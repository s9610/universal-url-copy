# Universal URL Copy privacy policy

Effective date: 2026-11-01.

## Page data

Universal URL Copy reads page data only after you click its toolbar icon or choose "Copy page" or "Copy link".
For a page, it reads the page title and address.
For a link, it reads the link address and text.
If the link has no text, it uses the link's extra label, or its address, as the title.
If it cannot find the link on the page, it uses the address as the title.

When you use the toolbar, the extension checks whether your selected text is inside a link on the main page.
If it is, it copies that link. Otherwise, it copies the page.
For "Copy link", it searches the links where you clicked for the first one with the same address.
It uses that link's text or extra label as the title.

The extension uses this page data only to build the text you copy to the clipboard.
It does not read the text already on your clipboard.
It does not save page titles, addresses, or link text for later use, or send this data anywhere.
It can keep the latest copy target in memory while the page is open, for the choice box or a retry.
Closing or reloading the page clears that memory.

## Saved settings

The only data the extension saves is these two settings in `chrome.storage.sync`.

| Setting | What it stores |
| --- | --- |
| `defaultModeEnabled` | Whether "Copy right away (don't ask)" is on. |
| `defaultOutput` | What to copy when that setting is on. `title-url` means the title and address. `url-only` means the address only. |

The extension saves each setting when you change it.
It reads the settings when you open Settings or start a copy.
Page titles, addresses, link text, and clipboard text are not saved with these settings.
If Chrome sync is on, Chrome may sync these settings with your Google account and Chrome on your other devices.
Your Chrome settings and Google's policies control that sync.

## Network and tracking

The extension makes no network requests.
It has no analytics, ads, or other tools that track how you use it.
All code comes with the extension. It does not load or run remote code.
Chrome may sync the settings as described above.

## Your clipboard

A copy replaces your clipboard text.
If another app saves your clipboard history or shares it across devices, that app's settings apply.
When you paste text into another service, that service's terms and policies apply.

## Contact

Use [GitHub Issues](https://github.com/s9610/universal-url-copy/issues) for questions about this policy.

## 日本語

施行日 2026年11月1日。

### ページの情報

Universal URL Copy は、ツールバーのアイコンを押すか、「Copy page」や「Copy link」を選んだ後にだけ、ページの情報を読み取ります。
ページの場合は、ページのタイトルとアドレスを読み取ります。
リンクの場合は、リンクのアドレスと文字を読み取ります。
リンクに文字がない場合は、リンクの補足の説明、またはアドレスをタイトルとして使います。
ページ上でリンクを見つけられない場合は、アドレスをタイトルとして使います。

ツールバーから使う場合は、選択した文字がページ本体のリンク内にあるかを確認します。
リンク内にある場合は、そのリンクをコピーします。それ以外の場合は、ページをコピーします。
「Copy link」では、クリックした場所のページ内にあるリンクを調べ、同じアドレスの最初のリンクを使います。
そのリンクの文字や補足の説明をタイトルとして使います。

拡張機能は、このページの情報を、クリップボードにコピーする文字を作るためにだけ使います。
コピー前のクリップボードの内容は読み取りません。
後で使うためにページのタイトル、アドレス、リンクの文字を保存したり、どこかへ送ったりしません。
選択画面ややり直しのために、ページを開いている間は直近のコピー対象をメモリに一時的に保持することがあります。
ページを閉じるか再読み込みすると、そのメモリ内の情報は消えます。

### 保存する設定

拡張機能が保存するデータは、`chrome.storage.sync` にある次の2つの設定だけです。

| 設定 | 保存する内容 |
| --- | --- |
| `defaultModeEnabled` | 「Copy right away (don't ask)」がオンかどうか。 |
| `defaultOutput` | すぐにコピーするときの内容。`title-url` はタイトルとアドレス、`url-only` はアドレスだけを表します。 |

設定を変更するたびに、その設定を保存します。
設定画面を開いたときや、コピーを始めたときに設定を読み取ります。
ページのタイトル、アドレス、リンクの文字、クリップボードの内容は、この設定と一緒に保存しません。
Chrome の同期がオンの場合は、Google アカウントを通じて他の端末の Chrome と設定を同期することがあります。
この同期には、Chrome の設定と Google のポリシーが適用されます。

### ネットワーク通信と利用状況の追跡

拡張機能はネットワーク通信を行いません。
利用状況の分析、広告、その他の利用状況を追跡する仕組みはありません。
動かす処理はすべて拡張機能に含まれています。リモートコードを読み込んだり実行したりしません。
Chrome は、前述のとおり設定を同期することがあります。

### クリップボード

コピーはクリップボードの内容を置き換えます。
ほかのアプリがクリップボードの履歴を保存したり、他の端末に引き継いだりする場合は、そのアプリの設定が適用されます。
ほかのサービスへ貼り付けた内容には、そのサービスの規約やポリシーが適用されます。

### お問い合わせ

このポリシーについての質問には [GitHub Issues](https://github.com/s9610/universal-url-copy/issues) を使ってください。
