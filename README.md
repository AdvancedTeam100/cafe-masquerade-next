## masquerade-web

### 必要ファイル
- `/.env.local`

### セットアップ
```shell
git clone git@github.com:OCTOBER-oct10/masquerade-web.git
cd masquerade-web
yarn install
yarn dev
```

### 開発方法
mainブランチをbaseブランチとして、機能単位（チケット単位）でPRをmainに向けて作る

### デプロイ方法
main -> productionブランチに向けてPRを作成し、マージする

### 設計書など
[/docs](https://github.com/OCTOBER-oct10/masquerade-web/tree/main/docs)を参照してください
