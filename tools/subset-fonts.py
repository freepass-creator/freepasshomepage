"""홈페이지 글꼴 줄이기 — 문구를 바꾼 뒤 한 번 돌린다.

본문(Pretendard)은 페이지에 실제 쓰인 글자만, 제목(지마켓산스)도 페이지에 쓰인 글자만 남겨
assets/fonts/ 에 woff2 로 둔다. 외부 글꼴 조각을 수십 개 받는 대신 파일 하나로 첫 화면을 빠르게 하려는 것.
필요: python -m pip install fonttools brotli   /  실행: python tools/subset-fonts.py
점검만: python tools/subset-fonts.py --check  (페이지 글자가 글꼴에 다 있는지, 빠지면 종료 코드 1)
"""
import pathlib, subprocess, sys, tempfile, urllib.request
sys.stdout.reconfigure(encoding="utf-8")

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = {
    "pretendard": "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/woff2/PretendardVariable.woff2",
    "gmarket": "https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansBold.woff",
}
PAGES = ["index.html", "about.html", "js/main.js"]
EXTRA = "·…—–‘’“”«»→←↗↓✓✕※"

def page_chars(extra=True):
    s = set(chr(c) for c in range(0x20, 0x7F)) | (set(EXTRA) if extra else set())
    for f in PAGES:
        s |= set((ROOT / f).read_text(encoding="utf-8"))
    return {c for c in s if c.isprintable()}


def check():
    from fontTools.ttLib import TTFont
    pc = page_chars(extra=False)
    bad = 0
    for name in ["PretendardVariable-site.woff2", "GmarketSansBold-sub.woff2"]:
        cmap = TTFont(ROOT / "assets" / "fonts" / name).getBestCmap()
        miss = sorted(c for c in pc if ord(c) not in cmap and not c.isspace())
        print(name, "빠진 글자:", "".join(miss) if miss else "없음")
        # 지마켓산스 원본에 없는 기호(✓ 등)는 원래 본문 글꼴로 보이므로 한글이 빠질 때만 실패로 본다
        bad += any("가" <= c <= "힣" for c in miss) if name.startswith("Gmarket") else bool(miss)
    sys.exit(1 if bad else 0)

if "--check" in sys.argv:
    check()

def run(*a):
    subprocess.run([sys.executable, "-m", *a], check=True)

with tempfile.TemporaryDirectory() as t:
    t = pathlib.Path(t)
    for k, u in SRC.items():
        urllib.request.urlretrieve(u, t / (k + ".src"))
    pc = page_chars()
    (t / "p.txt").write_text("".join(sorted(pc)), encoding="utf-8")
    (t / "g.txt").write_text("".join(sorted(pc)), encoding="utf-8")   # 제목 글꼴도 페이지 글자만(글자가 없으면 본문 글꼴로 보임)
    out = ROOT / "assets" / "fonts"
    run("fontTools.subset", str(t / "pretendard.src"), f"--text-file={t/'p.txt'}", "--flavor=woff2", "--layout-features=*", f"--output-file={t/'p.woff2'}")
    run("fontTools.varLib.instancer", str(t / "p.woff2"), "wght=300:800", "-o", str(out / "PretendardVariable-site.woff2"))
    run("fontTools.subset", str(t / "gmarket.src"), f"--text-file={t/'g.txt'}", "--flavor=woff2", "--layout-features=*", f"--output-file={out/'GmarketSansBold-sub.woff2'}")
    print("완료:", len(pc), "글자")
