# OpenVoiceOS Blog

This repo hosts the official [OpenVoiceOS](https://openvoiceos.org) blog. Live at: **https://blog.openvoiceos.org/**

For more information about OpenVoiceOS, visit [openvoiceos.org](https://openvoiceos.org).


## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Writing a post

See the [guide on how to add a blog post](https://blog.openvoiceos.org/newblog) for more info.

Create a new file in `/_posts/` following the naming convention `YYYY-MM-DD-your-post-title.md` with this front matter:

```yaml
---
title: "Your Post Title"
excerpt: "A short description shown in post previews."
coverImage: "/assets/blog/your-post/cover.jpg"
date: "2025-01-01"
author:
  name: Author Name
  picture: "/assets/blog/authors/avatar.jpg"
ogImage:
  url: "/assets/blog/your-post/cover.jpg"
---
```

## Contributing

Pull requests are welcome. For larger changes, open an issue first to discuss what you'd like to change.
