from __future__ import annotations

from pathlib import Path

from PIL import Image
from PIL import ImageOps


def save_webp(src: Path, dst: Path, *, lossless: bool, quality: int) -> None:
  with Image.open(src) as im:
    im = ImageOps.exif_transpose(im)
    if lossless:
      save_kwargs = {"lossless": True, "method": 6}
    else:
      save_kwargs = {"quality": quality, "method": 6}
      if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGB")
      if im.mode == "RGBA":
        im = im.convert("RGB")

    tmp = dst.with_suffix(dst.suffix + ".tmp")
    im.save(tmp, "WEBP", **save_kwargs)
    tmp.replace(dst)


def main() -> int:
  root = Path(__file__).resolve().parent

  sources: list[Path] = []
  portfolio_dir = root / "portfolio"
  image_root = portfolio_dir if portfolio_dir.exists() else root
  for pattern in ("before*.jpg", "after*.jpg"):
    sources.extend(sorted(image_root.glob(pattern)))

  service_area = root / "ServiceArea.png"
  if service_area.exists():
    sources.append(service_area)

  if not sources:
    print("No matching images found (portfolio/before*.jpg/portfolio/after*.jpg or before*.jpg/after*.jpg, plus ServiceArea.png).")
    return 1

  converted = 0
  skipped = 0

  for src in sources:
    dst = src.with_suffix(".webp")
    if dst.exists():
      try:
        with Image.open(src) as im_src:
          expected_size = ImageOps.exif_transpose(im_src).size
        with Image.open(dst) as im_dst:
          dst_size = im_dst.size
      except OSError:
        expected_size = None
        dst_size = None

      if dst.stat().st_mtime >= src.stat().st_mtime and expected_size == dst_size:
        skipped += 1
        continue

    is_service_area = src.name.lower() == "servicearea.png"
    save_webp(src, dst, lossless=is_service_area, quality=82)
    converted += 1
    print(f"wrote {dst.name}")

  print(f"done: {converted} converted, {skipped} up-to-date")
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
