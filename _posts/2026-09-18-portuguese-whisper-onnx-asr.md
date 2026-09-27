---
title: "Four Portuguese Whisper Fine-Tunes for onnx-asr, and Why You Must Set the Language"
excerpt: "OpenVoiceOS/onnx-asr-community-whisper on Hugging Face holds ONNX exports of four Portuguese Whisper fine-tunes, each with a licence and a measured error rate. These fine-tunes carry no language token, so a load without language='pt' lets the model translate or loop. This post shows the load and one number you can reproduce."
coverImage: "/assets/blog/portuguese-whisper-onnx-asr/thumb.png"
date: "2026-09-18T00:00:00.000Z"
author:
  name: JarbasAl
  picture: "https://avatars.githubusercontent.com/u/33701864"
ogImage:
  url: "/assets/blog/portuguese-whisper-onnx-asr/thumb.png"
---

## Four Portuguese Whisper Fine-Tunes for onnx-asr, and Why You Must Set the Language

[OpenVoiceOS/onnx-asr-community-whisper](https://huggingface.co/OpenVoiceOS/onnx-asr-community-whisper)
is a Hugging Face repository with one subfolder per model. Each subfolder is an
ONNX export of a Whisper fine-tune for Portuguese, in the layout that
[onnx-asr](https://github.com/istupakov/onnx-asr) reads for its `whisper`
model type.

The four models, their licences, and the word error rate (WER) their cards
state on the first 50 clips of the FLEURS `pt_br` test split:

| subfolder | source checkpoint | licence | card WER |
| --- | --- | --- | --- |
| `lgris__whisper-tiny-cv11-pt` | [lgris/whisper-tiny-cv11-pt](https://huggingface.co/lgris/whisper-tiny-cv11-pt) | apache-2.0 | 0.5385 |
| `lgris__whisper-small-cv11-pt` | [lgris/whisper-small-cv11-pt](https://huggingface.co/lgris/whisper-small-cv11-pt) | apache-2.0 | 0.3971 |
| `freds0__whisper-small-portuguese` | [freds0/whisper-small-portuguese](https://huggingface.co/freds0/whisper-small-portuguese) | apache-2.0 | 1.1668 |
| `freds0__distil-whisper-large-v3-ptbr` | [freds0/distil-whisper-large-v3-ptbr](https://huggingface.co/freds0/distil-whisper-large-v3-ptbr) | mit | 0.0659 |

The licence in each card is the one the source author states. We did not
mirror the Portuguese Whisper checkpoints that state no licence.

## Why this matters

onnx-asr runs Whisper on CPU through onnxruntime, with no torch and no
transformers. A fine-tune on Portuguese speech reads Portuguese better than the
base model of the same size, and these four are the Portuguese fine-tunes with
a licence we could check. The export batch also found one trap, and the trap
is the reason for this post.

## The trap: no language token

A Whisper decoder starts from a prompt. The base models put the language token
in that prompt. These four fine-tunes ship
`forced_decoder_ids [[1, None], [2, transcribe]]`: the slot for the language
token is empty. When you call `recognize()` without a language, onnx-asr lets
the model pick one.

On two Portuguese sentences synthesised with phoonnx (6 s and 17 s),
`lgris__whisper-small-cv11-pt` picked English and translated the long clip
(WER 1.070). `freds0__whisper-small-portuguese` fell into a repeated token,
`ʋa ʋa ʋa ...`, 56 words for one sentence (WER 1.302). The same two clips with
`language="pt"` read WER 0.000 and 0.023 on the first model, 0.000 and 0.000
on the second. The fp32 checkpoint of `whisper-small-portuguese` through
transformers reads 0.000 with or without a language, so the failure is in the
prompt, not in the weights.

The card WER of 1.1668 for `freds0__whisper-small-portuguese` was measured
without a language and is that failure. Its card says so. Always pass
`language="pt"`.

## Install and run

```bash
pip install "onnx-asr[cpu,hub]==0.12.0" jiwer soundfile pyarrow
```

The script below downloads the smallest mirror, decodes the first 50 clips of
the FLEURS `pt_br` test split, and prints the WER without a language and with
`language="pt"`. Both sides are lower-cased and stripped of punctuation before
the comparison. The FLEURS split is read from the parquet branch of
[google/fleurs](https://huggingface.co/datasets/google/fleurs); the file is
742 MB.

```python
import io
import re
import onnx_asr
import pyarrow.parquet as pq
import soundfile as sf
from huggingface_hub import hf_hub_download, snapshot_download
from jiwer import wer


def norm(text):
    return re.sub(r"[^\w\s]", "", text.lower()).split()

MIRROR = "lgris__whisper-tiny-cv11-pt"
root = snapshot_download("OpenVoiceOS/onnx-asr-community-whisper", allow_patterns=[f"{MIRROR}/*"])
model = onnx_asr.load_model("whisper", f"{root}/{MIRROR}")

parquet = hf_hub_download("google/fleurs", "pt_br/test/0000.parquet",
                          repo_type="dataset", revision="refs/convert/parquet")
rows = next(pq.ParquetFile(parquet).iter_batches(batch_size=50)).to_pylist()

for language in (None, "pt"):
    refs, hyps = [], []
    for row in rows:
        audio, sr = sf.read(io.BytesIO(row["audio"]["bytes"]), dtype="float32")
        hyps.append(" ".join(norm(model.recognize(audio, sample_rate=sr, language=language))))
        refs.append(" ".join(norm(row["transcription"])))
    print(f"language={language!r}: WER {wer(refs, hyps):.4f} on {len(rows)} clips")
    print("  clip 3:", hyps[3][:120])
print("ref 3:", refs[3][:120])
```

Output on a CPU box, onnx-asr 0.12.0, onnxruntime 1.30.0, huggingface-hub
1.32.0, about six and a half minutes for the two passes:

```text
language=None: WER 1.1226 on 50 clips
  clip 3: o romantismo t há um grande elemento
language='pt': WER 0.2597 on 50 clips
  clip 3: o romantismo te um grande elemento de terrenismo ritoral está ilo descritores como goethe feste e schelédio
ref 3: o romantismo tinha um grande elemento de determinismo cultural extraído de escritores como goethe fichte e schlegel
```

Without a language the tiny model stops early on clip 3 and the WER over the
50 clips is above 1. With `language="pt"` it reads the full sentence, with the
errors you expect from a tiny model on names.

To use another mirror, change `MIRROR` to one of the four subfolder names in
the table. The distil-large model is the one to use when the box has the
memory for it.

## Limits

- The export batch measured the card numbers without a language, on a
  different box and with a different text normalisation. The numbers you get
  from the script above are the ones to compare between the four mirrors, not
  the card numbers.
- onnx-asr 0.12.0 on PyPI loads a named model from the Hub root of a
  repository, or a model from a local path. A load by the three-segment name `OpenVoiceOS/onnx-asr-community-whisper/<subfolder>` needs
  [TigreGotico/onnx-asr#27](https://github.com/TigreGotico/onnx-asr/pull/27),
  which is open and not released. The script uses `snapshot_download` with an
  `allow_patterns` filter, which works on the released package.
- The mirrors are fp32 exports made with `optimum.exporters.onnx`. No
  quantised variant is published.
- `freds0__distil-whisper-large-v3-ptbr` ships its encoder weights in an
  external data file next to the graph. Download the whole subfolder, not the
  `.onnx` files alone.

## Where to report issues

A problem with a mirror, its card, or its licence goes to the
[community tab of the Hugging Face repository](https://huggingface.co/OpenVoiceOS/onnx-asr-community-whisper/discussions).
A problem with the loader goes to
[onnx-asr issues](https://github.com/istupakov/onnx-asr/issues). A problem
with the OVOS plugin that wraps it goes to
[ovos-stt-plugin-onnx-asr](https://github.com/TigreGotico/ovos-stt-plugin-onnx-asr/issues).

## Help Us Build Voice for Everyone

OpenVoiceOS is more than software, it’s a mission. If you believe voice assistants should be open, inclusive, and user-controlled, here’s how you can help:

- **💸 Donate**: Help us fund development, infrastructure, and legal protection.
- **📣 Contribute Open Data**: Share voice samples and transcriptions under open licenses.
- **🌍 Translate**: Help make OVOS accessible in every language.

We're not building this for profit. We're building it for people. With your support, we can keep voice tech transparent, private, and community-owned.

👉 [Support the project here](https://www.openvoiceos.org/contribution)
