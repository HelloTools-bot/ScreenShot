const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const isDebugger = false;

async function snap(url, save_to, save_pdf_to = save_to) {
    const browser = await puppeteer.launch({
        // 无头模式，不打开浏览器显示脚本运行过程，可以在调试过程中打开
        headless: true,
        // 设置浏览器窗口大小
        defaultViewport: {
          width: 1024,
          height: 655,
        }
      });

    const page = await browser.newPage();

    try {
        // 进入登陆页面，并等待直到没有网络连接的时候向下进行
        await page.goto(url, {
          waitUntil: 'networkidle2',
        });
    } catch(e) {
        console.log(`[Error] 错误原因: ${e}`);
        // 关闭浏览器并返回不再向下运行，本次Fetch失败
        await browser.close();
        return;
    }

    page.once('load', () => console.log('Page loaded!'));

    page.waitForTimeout(8000).then(() => console.log('[INFO] Waited 8 second, now let\'s snap and save!')); // 考虑到部分网站JavaScript加载延时

    await page.screenshot({ path: save_to, fullPage: true});

    await page.pdf({
        path: save_pdf_to,
        format: 'a4',
      });
    
    await browser.close();
}

/**
 * 请先阅读以下内容再提交PR，否则直接关闭！
 * 1. 我的PR是为了添加链接
 * 2. 我同意Github Community Guideline、JSDelivrEULA、
 *  甜力怕's 隐私政策 和 Chromium的许可证(BSD)
 * 3. 我愿意使用Fastgit.org 和 Github Pages作为内容分发
 * 4. 拒绝反动\暴力\色情\宗教\伦理类信息,最好不要推销V·P·N，支持非首页（您可以随时更改），支持但不建议JavaScript动态加载(未来会禁用)
 * 注意：在您更改后，如果出现反动\暴力\色情\宗教\伦理类信息，则立刻删除，并不给予告知！
 */
// 万能百度
snap('https://www.baidu.com', './snap/baidu.com.png', './pdf/baidu.com.pdf');
// 小猪博客
snap('https://xzblog.vercel.app/', './snap/xiaozhu2007-blog-vercel.png', './pdf/xiaozhu2007-blog-vercel.pdf');
// 小猪cnblogs
snap('https://cnblogs.com/xiaozhu2020/', './snap/xiaozhu2007-blog-cnblogs.png', './pdf/xiaozhu2007-blog-cnblogs.pdf');
// ChenYFan Blog
snap('https://blog.cyfan.top/', './snap/cyfan-blog.png', './pdf/cyfan-blog.pdf');
// 百度实时热搜榜
snap('https://top.baidu.com/board?tab=realtime', './snap/baidu-top.png', './pdf/baidu-top.pdf');
