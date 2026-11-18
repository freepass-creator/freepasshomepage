"""freepasserp.com 로고 글자(Exo 2: freepass 600 + erp.com 300)를 SVG 그림으로 만든다.

로고는 글자 대신 그림으로 두어야 명암 검사(로고 예외)와 글꼴 적재에 흔들리지 않는다.
만든 파일: assets/brand/freepasserp-bi.svg(밝은 바탕), freepasserp-bi-dark.svg(어두운 바탕)
그림 높이 1.2em = 글꼴 위아래(999+201)/1000, 아래 0.201em 이 글자 기준선 밑 → CSS 에서 vertical-align:-.201em
실행: python tools/make-bi-svg.py   (필요: fonttools brotli)
"""
import pathlib, sys, tempfile, urllib.request, subprocess
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = "https://fonts.gstatic.com/s/exo2/v26/7cHmv4okm5zmbtYoK-4.woff2"
PARTS = [("freepass", 600, "#1B2A4A", "#FFFFFF"), ("erp.com", 300, "#7F93B3", "#7F93B3")]

def kern(font, a, b):
    """GPOS 짝 간격(PairPos format 1·2)만 본다."""
    if "GPOS" not in font: return 0
    for lk in font["GPOS"].table.LookupList.Lookup:
        for st in lk.SubTable:
            st = getattr(st, "ExtSubTable", st)
            if getattr(st, "LookupType", None) != 2 and st.__class__.__name__ != "PairPos": continue
            cov = st.Coverage.glyphs
            if a not in cov: continue
            if st.Format == 1:
                for pvr in st.PairSet[cov.index(a)].PairValueRecord:
                    if pvr.SecondGlyph == b and pvr.Value1 is not None:
                        return getattr(pvr.Value1, "XAdvance", 0) or 0
            elif st.Format == 2:
                c1 = st.ClassDef1.classDefs.get(a, 0); c2 = st.ClassDef2.classDefs.get(b, 0)
                v = st.Class1Record[c1].Class2Record[c2].Value1
                if v is not None: return getattr(v, "XAdvance", 0) or 0
    return 0

with tempfile.TemporaryDirectory() as t:
    t = pathlib.Path(t); src = t / "exo2.woff2"; urllib.request.urlretrieve(SRC, src)
    paths, x = [], 0
    for text, w, light, dark in PARTS:
        inst = t / f"exo{w}.ttf"
        subprocess.run([sys.executable, "-m", "fontTools.varLib.instancer", str(src), f"wght={w}", "-o", str(inst)], check=True, capture_output=True)
        f = TTFont(inst); gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f["hmtx"]
        names = [cmap[ord(c)] for c in text]; d = []
        for i, g in enumerate(names):
            pen = SVGPathPen(gs)
            gs[g].draw(TransformPen(pen, (1, 0, 0, -1, x, 999)))
            d.append(pen.getCommands())
            x += hmtx[g][0] + (kern(f, g, names[i + 1]) if i + 1 < len(names) else 0)
        paths.append((" ".join(d), light, dark))
    W = round(x)
    for name, idx in (("freepasserp-bi.svg", 1), ("freepasserp-bi-dark.svg", 2)):
        body = "".join(f'<path fill="{p[idx]}" d="{p[0]}"/>' for p in paths)
        svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 1200" width="{W}" height="1200" role="img" aria-label="freepasserp.com">{body}</svg>\n'
        (ROOT / "assets" / "brand" / name).write_text(svg, encoding="utf-8")
    print("완료 너비", W, "높이 1200 (1em=1000)")
