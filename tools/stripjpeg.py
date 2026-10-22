# Lossless metadata strip: drops EXIF/XMP (APP1), IPTC (APP13) and comments; keeps the image data and ICC colour profile byte for byte.
import sys, struct
KEEP = {0xE0, 0xE2, 0xEE}  # JFIF, ICC profile, Adobe
def strip(src, dst):
    d = open(src, 'rb').read(); assert d[:2] == b'\xff\xd8'
    out = bytearray(b'\xff\xd8'); i = 2
    while True:
        assert d[i] == 0xFF, (src, i)
        m = d[i + 1]
        if m == 0xDA: out += d[i:]; break   # start of scan: copy the rest untouched
        n = struct.unpack('>H', d[i + 2:i + 4])[0]
        seg = d[i:i + 2 + n]
        if not (0xE0 <= m <= 0xEF or m == 0xFE) or m in KEEP: out += seg
        i += 2 + n
    open(dst, 'wb').write(out)
if __name__ == '__main__': strip(sys.argv[1], sys.argv[2])
