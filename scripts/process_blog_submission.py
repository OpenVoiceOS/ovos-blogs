#!/usr/bin/env python3
"""
Process blog submission from GitHub Issue.

This script extracts JSON from a GitHub Issue body, validates it,
and creates a markdown blog post file in the _posts directory.
"""

import json
import re
import os
import sys
from datetime import datetime
from pathlib import Path


def extract_json_from_issue(issue_body: str) -> dict:
    """Extract and parse JSON from issue body code fence."""

    # Find the ```json marker
    json_start_marker = '```json'
    marker_pos = issue_body.find(json_start_marker)

    if marker_pos == -1:
        raise ValueError("Could not find ```json marker in issue body")

    # Find the opening brace after the marker
    search_start = marker_pos + len(json_start_marker)
    brace_pos = issue_body.find('{', search_start)

    if brace_pos == -1:
        raise ValueError("Could not find JSON object start '{' after ```json marker")

    # Now find the matching closing brace by counting braces
    # We need to handle braces inside strings carefully
    json_start = brace_pos
    depth = 0
    in_string = False
    escape_next = False
    json_end = -1

    for i in range(json_start, len(issue_body)):
        char = issue_body[i]

        if escape_next:
            escape_next = False
            continue

        if char == '\\' and in_string:
            escape_next = True
            continue

        if char == '"' and not escape_next:
            in_string = not in_string
            continue

        if not in_string:
            if char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    json_end = i + 1
                    break

    if json_end == -1:
        raise ValueError("Could not find matching closing brace for JSON object")

    json_str = issue_body[json_start:json_end]

    # Debug: Print first 500 chars of extracted JSON
    print(f"Extracted JSON (first 500 chars):\n{json_str[:500]}...")

    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        # Provide more helpful error message
        lines = json_str.split('\n')
        error_line = e.lineno - 1 if e.lineno <= len(lines) else len(lines) - 1
        context_start = max(0, error_line - 2)
        context_end = min(len(lines), error_line + 3)

        context = '\n'.join(f"{'>>>' if i == error_line else '   '} {i+1}: {lines[i]}"
                           for i in range(context_start, context_end))

        raise ValueError(
            f"Invalid JSON at line {e.lineno}, column {e.colno}: {e.msg}\n"
            f"Context:\n{context}"
        )


def validate_payload(payload: dict) -> None:
    """Validate the submission payload has required fields."""

    required_fields = ['title', 'excerpt', 'author', 'content']
    missing = [f for f in required_fields if f not in payload]

    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    if not isinstance(payload['author'], dict):
        raise ValueError("'author' must be an object with 'name' and 'github' fields")

    author_fields = ['name', 'github']
    missing_author = [f for f in author_fields if f not in payload['author']]

    if missing_author:
        raise ValueError(f"Author missing required fields: {', '.join(missing_author)}")

    # Validate types
    if not isinstance(payload['title'], str) or not payload['title'].strip():
        raise ValueError("'title' must be a non-empty string")

    if not isinstance(payload['excerpt'], str) or not payload['excerpt'].strip():
        raise ValueError("'excerpt' must be a non-empty string")

    if not isinstance(payload['content'], str) or not payload['content'].strip():
        raise ValueError("'content' must be a non-empty string")


def generate_slug(title: str) -> str:
    """Generate URL-safe slug from title."""
    # Convert to lowercase and replace non-alphanumeric with hyphens
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower())
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    # Collapse multiple hyphens
    slug = re.sub(r'-+', '-', slug)
    return slug


def escape_yaml_string(s: str) -> str:
    """Escape a string for use in YAML."""
    # Replace backslashes first, then quotes
    s = s.replace('\\', '\\\\')
    s = s.replace('"', '\\"')
    return s


def build_frontmatter(payload: dict, date_str: str) -> str:
    """Build YAML frontmatter from payload."""

    author_github = payload['author']['github'].lstrip('@')
    cover_image = payload.get('coverImage', '/assets/blog/common/cover.png')

    # Escape strings for YAML
    title = escape_yaml_string(payload['title'])
    excerpt = escape_yaml_string(payload['excerpt'])
    author_name = escape_yaml_string(payload['author']['name'])

    lines = [
        '---',
        f'title: "{title}"',
        f'excerpt: "{excerpt}"',
        f'coverImage: "{cover_image}"',
        f'date: "{date_str}T00:00:00.000Z"',
        'author:',
        f'  name: "{author_name}"',
        f'  picture: "https://github.com/{author_github}.png"',
    ]

    # Add coauthors if present
    coauthors = payload.get('coauthors', [])
    if coauthors and isinstance(coauthors, list):
        lines.append('coauthors:')
        for ca in coauthors:
            if isinstance(ca, dict) and 'name' in ca and 'github' in ca:
                ca_name = escape_yaml_string(ca['name'])
                ca_github = ca['github'].lstrip('@')
                lines.append(f'  - name: "{ca_name}"')
                lines.append(f'    picture: "https://github.com/{ca_github}.png"')

    lines.extend([
        'ogImage:',
        f'  url: "{cover_image}"',
        '---',
        '',
    ])

    return '\n'.join(lines)


def process_submission(issue_body_file: str, output_dir: str = '_posts') -> dict:
    """
    Process a blog submission from an issue body file.

    Args:
        issue_body_file: Path to file containing the issue body
        output_dir: Directory to write the markdown file to

    Returns:
        Dictionary with filename, filepath, title, and author
    """

    # Read issue body from file
    issue_body_path = Path(issue_body_file)
    if not issue_body_path.exists():
        raise FileNotFoundError(f"Issue body file not found: {issue_body_file}")

    issue_body = issue_body_path.read_text(encoding='utf-8')
    print(f"Read {len(issue_body)} characters from {issue_body_file}")

    # Extract and validate JSON
    payload = extract_json_from_issue(issue_body)
    print("Successfully parsed JSON payload")

    validate_payload(payload)
    print("Payload validation passed")

    # Generate filename
    slug = generate_slug(payload['title'])
    date_str = datetime.now().strftime('%Y-%m-%d')
    filename = f"{date_str}-{slug}.md"

    # Build the markdown file
    frontmatter = build_frontmatter(payload, date_str)
    content = payload['content']

    # Ensure content doesn't start with extra newlines
    content = content.lstrip('\n')

    full_content = frontmatter + content

    # Write the file
    output_path = Path(output_dir) / filename
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(full_content, encoding='utf-8')

    print(f"Created {output_path}")

    return {
        'filename': filename,
        'filepath': str(output_path),
        'title': payload['title'],
        'author': payload['author']['name'],
    }


def write_github_output(outputs: dict) -> None:
    """Write outputs for GitHub Actions."""
    github_output = os.environ.get('GITHUB_OUTPUT')

    if github_output:
        with open(github_output, 'a') as f:
            for key, value in outputs.items():
                # Escape newlines in values
                escaped_value = str(value).replace('\n', '%0A')
                f.write(f"{key}={escaped_value}\n")
        print(f"Wrote {len(outputs)} outputs to GITHUB_OUTPUT")
    else:
        print("GITHUB_OUTPUT not set, printing outputs:")
        for key, value in outputs.items():
            print(f"  {key}={value}")


def main():
    """Main entry point."""

    # Get issue body file from argument or environment
    if len(sys.argv) > 1:
        issue_body_file = sys.argv[1]
    else:
        issue_body_file = os.environ.get('ISSUE_BODY_FILE', '/tmp/issue_body.txt')

    # Get output directory
    output_dir = os.environ.get('OUTPUT_DIR', '_posts')

    print(f"Processing submission from: {issue_body_file}")
    print(f"Output directory: {output_dir}")

    try:
        outputs = process_submission(issue_body_file, output_dir)
        write_github_output(outputs)
        print("\nSuccess!")
        return 0

    except FileNotFoundError as e:
        print(f"::error::File not found: {e}")
        return 1

    except ValueError as e:
        print(f"::error::Validation error: {e}")
        return 1

    except Exception as e:
        print(f"::error::Unexpected error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == '__main__':
    sys.exit(main())
