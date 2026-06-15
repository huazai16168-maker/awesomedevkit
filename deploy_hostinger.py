"""
AwesomeDevKit 部署脚本
用法：
  1. 先 npm run build （生成 out/ 目录）
  2. 运行 python deploy_hostinger.py

把 out/ 目录下所有文件上传到 Hostinger public_html/
"""

import os
import sys
from ftplib import FTP

# ====== 配置 ======
FTP_HOST = "82.29.81.141"  # 同 Hostinger IP
FTP_USER = "u476340197.awesomedevkit.com"  # 如果主机面板有单独 FTP 账号则改这里
FTP_PASS = "Tvb668899$"
REMOTE_DIR = "/public_html/"
LOCAL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "out")

ALLOWED_EXTENSIONS = {
    ".html", ".htm", ".css", ".js", ".jsx", ".ts", ".tsx",
    ".json", ".xml", ".txt", ".ico", ".png", ".jpg", ".jpeg",
    ".gif", ".svg", ".webp", ".woff", ".woff2", ".map",
}


def should_upload(filename: str) -> bool:
    """过滤不需要上传的文件"""
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False
    # 跳过隐藏文件
    if filename.startswith("."):
        return False
    return True


def upload_file(ftp: FTP, local_path: str, remote_path: str) -> None:
    """上传单个文件"""
    try:
        with open(local_path, "rb") as f:
            ftp.storbinary(f"STOR {remote_path}", f)
        print(f"  ✅ {remote_path}")
    except Exception as e:
        print(f"  ❌ {remote_path} — {e}")


def ensure_remote_dir(ftp: FTP, remote_dir: str) -> None:
    """确保远程目录存在"""
    parts = remote_dir.strip("/").split("/")
    current = ""
    for part in parts:
        if not part:
            continue
        current += f"/{part}"
        try:
            ftp.cwd(current)
        except Exception:
            try:
                ftp.mkd(current)
                print(f"  📁 创建目录 {current}")
            except Exception as e:
                print(f"  ⚠️ 无法创建目录 {current}: {e}")


def upload_directory(ftp: FTP, local_dir: str, remote_dir: str) -> None:
    """递归上传目录"""
    for root, dirs, files in os.walk(local_dir):
        for file in files:
            if not should_upload(file):
                continue

            local_path = os.path.join(root, file)
            rel_path = os.path.relpath(local_path, local_dir)
            remote_path = f"{remote_dir.rstrip('/')}/{rel_path.replace(os.sep, '/')}"

            # 确保远程目录存在
            remote_file_dir = "/" + "/".join(remote_path.strip("/").split("/")[:-1])
            ensure_remote_dir(ftp, remote_file_dir)

            upload_file(ftp, local_path, remote_path)


def main():
    if not os.path.isdir(LOCAL_DIR):
        print(f"❌ 没找到 {LOCAL_DIR} 目录")
        print("请先运行: npm run build")
        sys.exit(1)

    print("=" * 50)
    print("AwesomeDevKit → Hostinger 部署")
    print("=" * 50)
    print(f"本地目录: {LOCAL_DIR}")
    print(f"远程目录: {REMOTE_DIR}")
    print(f"FTP 主机: {FTP_HOST}")
    print()

    try:
        ftp = FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        ftp.encoding = "utf-8"
        print("✅ FTP 登录成功")
        print()

        upload_directory(ftp, LOCAL_DIR, REMOTE_DIR)

        ftp.quit()
        print()
        print("=" * 50)
        print("✅ 部署完成！")
        print("=" * 50)
    except Exception as e:
        print(f"❌ FTP 连接失败: {e}")
        print()
        print("可能的原因：")
        print("  1. FTP 账号密码不对")
        print("  2. Hostinger 的 FTP 地址不是这个 IP")
        print("  3. 需要在 Hostinger 面板先创建子域名或添加域名")
        sys.exit(1)


if __name__ == "__main__":
    main()
