Lemmings
========

fixed point observation

## Install
```
git clone https://github.com/Lemmings/lemmings-commander.git
cd lemmings-commander
npm install
node app
```

## License
MIT

## コレは何？
何かのデータを公開しているページからデータを定期的に取りに行くクローラー
パラレル処理、パイプライン処理を前提に作っているので大量のエージェントを捌ける予定

## チュートリアル
単に起動するだけではなにもしないです。
[www.yahoo.co.jp] を取得してコンソールに出力するサンプルがあるのでそれを使います。
lemmingsのディレクトリで以下のコマンドを実行してリンクを作成します
```
cd agents
ln -s ../agents_define/yahoo_get.json
```
できたらapp.jsを起動します。

300秒ごとにトップページが表示できていれば成功です。

