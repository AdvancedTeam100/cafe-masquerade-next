# masquerade-web

## 技術スタック

- TypeScript
- React
  - Next.js
  - Redux
- Firebase
  - Authentication
  - Firestore
  - Cloud Functions
  - Cloud Storage

## Firestore 構成

- adminUsers
- blockedContactUsers
- castTags
- casts
  - calendarEvents
  - castImages
  - youtubeVideos
- contents
- livestreamingSlots
- livestreamings
  - livestreamingCredentials
  - livestreamingMessages
- news
- newsTags
- schedules
- users

### adminUsers(管理者)

path: `adminUsers/{uid}`
docId: Firebase Authにて生成されるID
| 論理名 | 物理名 | 型 | 説明 | サンプル |
| ---------- | ------------- | -------- | -------------- | ------------- |
| ユーザーID | uid | string | ユーザーのID | "6lK9I7XYI6gXTHoYz3vunfQiEbM2" |
| 名前 | displayName | string | 管理者の名前 Firebase Authに保存されているdisplayNameと等しい | "Admin user" |
| メールアドレス | email | string | 管理者のメールアドレス Firebase Authに保存されているemailと等しい | "example@test.com" |
| アバターURL | avatarUrl | string | 管理者のアバター画像 Firebase Authに保存されているphotoURLと等しい | "https://lh3.googleusercontent.com/a-/AOh14GgKsezkDr5mC-S-qHhNASqmEH8XYWVuHdyRqcra=s96-c" |
| 権限 | role | "superAdmin" \| "admin" \| "cast" | 管理者の権限 | "admin" |
| キャストID | castId | string? \| null | 管理者の権限がキャストの場合に紐づくcastドキュメントのID | "007tesla-itoshino" |
| 表示名 | publicDisplayName | string | チャット欄などで一般公開される表示名 | "支配人" |
| 表示用アバターURL | publicAvatarUrl | string | チャット欄などで一般公開されるアバターURL | "https://firebasestorage.googleapis.com/v0/b/~~~~" |
| 作成日時  | createdAt | timestamp | 作成日時  | 2019 年 4 月 1 日 0:00:00 UTC+9 |
| 更新日時  | updatedAt | timestamp | 更新日時  | 2019 年 4 月 1 日 0:00:00 UTC+9 |

### blockedContactUsers(ブロックしたユーザー)

path: `blockedContactUsers/{userId}`
docId: 自動生成
| 論理名 | 物理名 | 型 | 説明 | サンプル |
| ---------- | ------------- | -------- | -------------- | ------------- |
| ID | id | string | ドキュメントID | "5aBkpm9IgXILISqlSQwj" |
| メールアドレス | email | string | ブロックしているユーザーのメールアドレス | "example@test.com" |
| ブロック日時 | blockedAt | timestamp | ブロックした日時 | 2019 年 4 月 1 日 0:00:00 UTC+9 |

### castTags(キャストのタグ)

path: `castTags/{tagName}`
docId: name
| 論理名 | 物理名 | 型 | 説明 | サンプル |
| ----| ---- | ------- | ------- | ---------- |
| 名前 | name | string | タグの名前 | "お知らせ" |

### casts(キャスト)

path: `casts/{castId}`
docId: キャストの識別子、スラッグ
| 論理名 | 物理名 | 型 | 説明 | サンプル |
| ---------- | ------------- | -------- | -------------- | ------------- |
| ID | id | string | キャストの id | "momoka-moka" |
| 名前 | name | string | キャストの名前 | "萌々嫁もか" |
| 説明 | description | string | キャストの説明 | "好奇心旺盛でえっちなことにも興味津々な女の子。" |
| 本人コメント | selfIntroduction | string | キャスト本人の説明 | "好奇心旺盛でえっちなことにも興味津々な女の子。" |
| 身体情報 | physicalInformation | {height: number; weight: number; bustSize: number; waistSize: number; hipSize: number; cupSize: string;} | キャストの身体情報 | {height: 153; weight: 48; bustSize: 80; waistSize: 50; hipSize: 80; cupSize: "D";} |
| トップ画像 URL | imageUrl | string | キャストの身体情報 | "https://storage.com/casts/{castsId}/images/***" |
| タグ 　 | tags | string[] | タグの documentId | ["かわいい", "ロリ"] |
| ステータス | status | string | お知らせのステータス Published: 公開 Draft: 下書き | Published |
| YouTube チャンネル ID | youtubeChannelId | string | キャストのYouTubeチャンネルのID | UCxBmyZNQDFJVr9-ZE7hAYfA |
| YouTube 2nd チャンネル ID | youtubeChannelIdSecond | string | キャストのYouTube2ndチャンネルのID | UCxBmyZNQDFJVr9-ZE7hAYfA |
| ソーシャル Id | socialId | {twitter: string; twitcating?: string; tiktok?: string; niconico?: string; } | ソーシャルサービスの Id | {twitter: "momokamoka" } |
| ライブ配信開始の通知用URL | notificationDiscordUrl | string |  | https://discord.com/api/webhooks/1234567890/honya-morake |
| 質問 | qa | { question: string; answer: string; }[] | キャストへの質問と回答 | [{ question: "誕生日は？"; answer: "2月24日" }] |
| 入店日 | joinedAt | timestamp | 入店日 | 2019 年 6 月 1 日 0:00:00 UTC+9 |
| 作成日時 | createdAt | timestamp | 作成日時 | 2019 年 4 月 1 日 0:00:00 UTC+9 |
| 更新日時 | updatedAt | timestamp | 更新日時 | 2019 年 5 月 1 日 0:00:00 UTC+9 |


### calendarEvents(カレンダーの予定)

path: `casts/{castId}/calendarEvents/{calendarEventId}`
docId: GCal の eventId  
CFsのupdateCastCalendarEvents関数にて取得される

| 論理名   | 物理名      | 型        | 説明               | サンプル                         |
| -------- | ----------- | --------- | ------------------ | -------------------------------- |
| ID       | id          | string    | eventId            | "dadasfsgd24"                    |
| タイトル | title       | string    | イベントのタイトル | "夢宮ありすおきゅうし"           |
| 説明     | description | string    | イベントの説明     | ""                               |
| 開始日時 | startAt     | timestamp | イベントの開始日時 | 2021 年 4 月 1 日 10:00:00 UTC+9 |
| 終了日時 | endAt       | timestamp | イベントの終了日時 | 2021 年 4 月 1 日 20:00:00 UTC+9 |
### castImages(キャスト画像)

path: `casts/{castId}/castImages/{imageId}`
docId: 0*{castId}, 1*{castId}, 2*{castId}

| 論理名     | 物理名   | 型     | 説明       | サンプル                                         |
| ---------- | -------- | ------ | ---------- | ------------------------------------------------ |
| ID         | id       | string | 画像の Id  | "1\_{castId}"                                    |
| 画像の URL | imageUrl | string | 画像の URL | "https://storage.com/casts/{castsId}/images/***" |

### youtubeVideos(YouTube 動画)

path: `casts/{castId}/youtubeVideos/{youtubeVideoId}`
docId: YouTube の videoId   
CFsのupdateCastYoutubeVideos関数にて取得される
| 論理名           | 物理名               | 型                                           | 説明                 | サンプル                         |
| ---------------- | -------------------- | -------------------------------------------- | -------------------- | -------------------------------- |
| ID               | id                   | string                                       | youtube videoId      | "dadasfsgd24"                    |
| チャンネルID               | channelId            | string                                       | youtube channelId    | "alice-yume"                     |
| タイトル         | title                | string                                       | イベントのタイトル   | "夢宮ありすおきゅうし"           |
| サムネイル       | thumbnails           | youtube_v3.Schema$ThumbnailDetails;          | サムネイル           |                                  |
| ライブ動画の状態 | liveBroadcastContent | "live" \| "upcoming" \| "none                | ライブ動画の状態     | "upcoming"                       |
| ライブ配信情報   | liveStreamingDetails | youtube_v3.Schema$VideoLiveStreamingDetails; | ライブ配信の詳細情報 |                                  |
| 開始日時         | startAt              | timestamp                                    | イベントの開始日時   | 2021 年 4 月 1 日 10:00:00 UTC+9 |

### contents(コンテンツ)

path: `contents/{contentType}`  
docId: "home" | "about"

### contents/home(ホーム)

path: `contents/home`
docId: "home"

| 論理名         | 物理名    | 型                               | 説明                                   | サンプル                                                  |
| -------------- | --------- | -------------------------------- | -------------------------------------- | --------------------------------------------------------- |
| サイドのリンク | sideLinks | {title: string; href: string;}[] | サイドバーのリンクのタイトル、リンク先 | [{title: "オンラインサロン", href: "https://sample.com"}] |
| トップ画像     | topImages | {url: string; href: string}[]                  | トップでカルーセル表示させる画像       | [{url: "https://storage.com/~/~, href: "https://example.com}]                         |
| 口コミツイートID  | reviewTweetIds | string[]                  | #ますかれーどのツイートID   | ["1446705868729241600", "1446705868729241601"]                         |
| キャストツイートID  | reviewTweetIds | string[]                  | キャストが投稿したツイートのID   | ["1446705868729241600", "1446705868729241601"]                         |
| 更新日時       | updatedAt | timestamp                        | 更新日時                               | 2019 年 4 月 1 日 0:00:00 UTC+9                           |

### contents/about(ご利用方法)

path: `contents/about`
docId: "about"

| 論理名     | 物理名    | 型                                                    | 説明               | サンプル                                                                                                 |
| ---------- | --------- | ----------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------- |
| コンテンツ | contents  | {title: string; subTitle: string; content: string;}[] | 説明の見出しと内容 | [{title: "オンラインサロンについて", subTitle: "Salon", content: "\<h1>オンラインサロンとは\</h1>~~~~"}] |
| 更新日時   | updatedAt | timestamp                                             | 更新日時           | 2019 年 4 月 1 日 0:00:00 UTC+9                                                                          |

### livestreamingSlots(ライブ配信スロット)

path: `livestreamingSlots/{livestreamingSlotName}`
docId: name

| 論理名             | 物理名            | 型        | 説明                   | サンプル                            |
| ------------------ | ----------------- | --------- | ---------------------- | ----------------------------------- |
| name               | name              | string    | Slot name              | "octomas-masquerade"                |
| プレイバックURL | playbackUrl  | {hls: string;} | SlotのplaybackURL | {hls: "http://{env}.mmdlive.lldns.net/{env}/~~~" } |
| エンコーダー情報 | encoder  | { username: string; password: string; streamkey: string; ingestUrl: { primary: string; backup: string } } | エンコーダーに入力するスロットの情報 | { username: "masq", password: "password", streamkey: "123dknh1" ingestUrl: { primary: "rtmp://{slotName}.{env}.pri.lldns.net/{env}"; backup: "rtmp://{slotName}.{env}.bak.lldns.net/{env}" } } |
| SharedSecret           |  sharedSecret        | string | ハッシュ化されたトークンを生成する際のKey               | "sharedsecret"     |
| 作成日時           | createdAt         | timestamp | 作成日時               | 2019 年 4 月 1 日 0:00:00 UTC+9     |

### livestreamings(ライブ配信)

path: `livestreamings/{livestreamingId}`
docId: 自動生成

| 論理名               | 物理名       | 型        | 説明                                                                            | サンプル                                          |
| -------------------- | ------------ | --------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| ID                   | id           | string    | ドキュメントID                                                             | "jd1a2n2hdadh"                                    |
| タイトル             | title        | string    | ライブ配信のタイトル                                                            | "テスト配信 1"                                    |
| 説明                 | description  | string    | ライブ配信の説明                                                                | "テスト配信です"                                  |
| ステータス           | status       | "Scheduled" \| "Streaming" \| "Finished"    | ライブ配信のステータス Scheduled: 公開予定 Streaming: 配信中 Finished: 配信済み | Scheduled                                         |
| サムネイル URL 　    | thumbnailUrl | string    | サムネイルの画像 URL                                                            | "https://storage.com/livestreaming/thumbnails/*** |
| キャストID | castId     | string?    | 配信キャストのID | "pepero-neko"                            |
| 閲覧に必要なロール | requiredRole     | "diamond" \| "platinum" \| "gold" \|"silver" \| "bronze"    | 配信を閲覧できるロール | "diamond"                            |
| 録画可否 | shouldStartRecording | boolean | 配信を録画するかどうかのフラグ。falseの場合録画しない | true |
| 動画情報 | videoConfig | {status: string; type: string \| null; requiredRole: string \| null; expiredAt: Record<role, timestamp>; }? \| null | 動画に変換する際の情報。shouldStartRecording: trueの場合必須フィールド | {status: "Published", type: "LiveAction", requiredRole: "gold", expiredAt: {gold: 2021年10月9日 15:10:18 UTC+9}} |
| 配信日時             | publishedAt  | timestamp | 配信日時                                                                        | 2019 年 4 月 1 日 0:00:00 UTC+9                   |
| 作成日時             | createdAt    | timestamp | 作成日時                                                                        | 2019 年 4 月 1 日 0:00:00 UTC+9                   |
| 更新日時             | updatedAt    | timestamp | 更新日時                                                                        | 2019 年 4 月 1 日 0:00:00 UTC+9                   |
| 録画開始日時          | startRecordAt| timestamp? | 更新日時                                                                        | 2019 年 4 月 1 日 0:00:00 UTC+9                   |
| 配信終了日時          | finishedAt| timestamp? | 配信終了日時                                                                        | 2019 年 4 月 1 日 0:00:00 UTC+9                   |
| 録画ID       |recordScheduleId| string? | ライブ配信の録画スケジュールのID | "d24bnoiu90s" |
| スロットID       |recordSlotId| string? | ライブ配信のスロットのID．Streamkeyと同じ | "d24bnoiu90s" |
| 録画状態 | recordingStatus | "Recording" \| "Processing" \| "FilesReady" \| "UploadedToGCS" \| "RequestedTranscode" \| "Transcoded" | LLNWのLive to VoD機能における録画状態を保持する． | "Recording" |


### livestreamingCredentials(認証情報)

path: `livestreamings/{livestreamingId}/livestreamingCredentials/{credentialType}`  
docId: "info" | "password"

### livestreamingCredentials/info(ストリーミング情報)

path: `livestreamings/{livestreamingId}/livestreamingCredentials/info`
docId: "info"

| 論理名             | 物理名            | 型     | 説明                   | サンプル                                                                                       |
| ------------------ | ----------------- | ------ | ---------------------- | ---------------------------------------------------------------------------------------------- |
| スロット名           | slotName           | string | スロット名 livestreamingSlotのIDと同じ           | "masqueradeMMD"                                                                                      |
| 配信URL        | encodedUrl        | string | エンコードされた配信URL         | "https://{env}.mmdlive.lldns.net/{env}/{secret}/manifest.m3u8?p=78&e={expireDate}&h={token}" |
| [Deprecated. RTS only] Short name         | shortName         | string | ショートネーム         | "octomas"                                                                                      |
| [Deprecated. RTS only] Stream name        | streamName        | string | ストリームネーム       | "october-rmv"                                                                                  |
| [Deprecated. RTS only] Host               | host              | string | ホスト                 | "octomas-rts.s.llnwi.net"                                                                      |
| [Deprecated. RTS only] Shared Secret      | sharedSecret      | string | シェアードシークレット | "M@squer4de"                                                                                   |
| [Deprecated. RTS only] Published HostName | publishedHostName | string | 公開ホスト名           | "subscribe-validator.rts.llnwi.net"                                                            |

### livestreamingCredentials/password(パスワード)

path: `livestreamings/{livestreamingId}/livestreamingCredentials/password`
docId: "password"

| 論理名               | 物理名      | 型     | 説明                       | サンプル               |
| -------------------- | ----------- | ------ | -------------------------- | ---------------------- |
| パスワードの hash 値 | password    | string | ハッシュ化されたパスワード | "bbu23423j;;2k3n43n2j" |
| 自動生成されるパスワード(後から編集可) | rawPassword | string | 配信枠作成時に自動生成されたパスワード | "testPassword123"      |

### livestreamingMessages(メッセージ)

path: `livestreamings/{livestreamingId}/livestreamingMessages/{livestreamingMessageId}`
docId: 自動生成

| 論理名   | 物理名    | 型                                 | 説明                 | サンプル                                                                               |
| -------- | --------- | ---------------------------------- | -------------------- | -------------------------------------------------------------------------------------- |
| ID | id      | string                             | ドキュメントID | "003y235scWu9L26ewfCt"                                                           |
| テキスト | text      | string                             | メッセージのテキスト | "ありすちゃんかわいいーｗｗ"                                                           |
| 投稿者   | user      | {name: string; avatarUrl: string; isAdmin?: boolean; userId?: string; castId?: string;} | ユーザーの情報       | {name: "ようくん", avatarUrl: "https://storage.com/livestreaming/messages/24usfsdfnj", userId: "876007440649453588"} |
| メッセージの色 | color | string?                          | 表示するメッセージの色            | "#fff"    |
| 固定可否 | isFixed | boolean?                          | メッセージを固定するかどうか            | true    |
| 作成日時 | createdAt | timestamp                          | 作成日時             | 2019 年 4 月 1 日 0:00:00 UTC+9                                                        |
| 相対作成時間 | relativeCreationTime | number | `livestreamings/{livestreamingId}` の `startRecordAt` を起点とした経過時間． ミリセカンド． | 100000 |

### news(お知らせ)

path: `news/{newsId}`
docId: 自動生成

| 論理名            | 物理名        | 型        | 説明                                               | サンプル                                                          |
| ----------------- | ------------- | --------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| ID                | id            | string    | ドキュメントID                                 | "jd1a2n2hdadh"                                                    |
| タイトル          | title         | string    | お知らせのタイトル                                 | "ライブ配信のお知らせ 1"                                          |
| 説明              | description   | string    | お知らせの説明                                     | "ラブ配信のお知らせです。本日、リリースしました。"                |
| 内容              | content       | string    | お知らせの内容                                     | "ラブ配信のお知らせです。本日、リリースしました。さて、本日は..." |
| ステータス        | status        | string    | お知らせのステータス Published: 公開 Limited: 限定公開 Draft: 下書き | Published                                                         |
| サムネイル URL 　 | imageUrl      | string    | サムネイルの画像 URL                               | "https://storage.com/news/{newsId}/images/***"                    |
| 作成者 ID 　      | createdUserId | string    | お知らせ作成者の uuid                              | "d24bnoiu90s"                                                     |
| 更新者 ID 　      | updatedUserId | string    | お知らせ更新者の uuid                              | "d24bnoiu90s"                                                     |
| タグ 　           | tags          | string[]  | タグの documentId                                  | ["お知らせ", "news"]                                              |
| 公開日時          | publishedAt   | timestamp | 公開日時                                           | 2019 年 4 月 1 日 0:00:00 UTC+9                                   |
| 作成日時          | createdAt     | timestamp | 作成日時                                           | 2019 年 4 月 1 日 0:00:00 UTC+9                                   |
| 更新日時          | updatedAt     | timestamp | 更新日時                                           | 2019 年 4 月 1 日 0:00:00 UTC+9                                   |

### newsTags(お知らせのタグ)

path: `newsTags/{tagName}`
docId: name
| 論理名 | 物理名 | 型 | 説明 | サンプル |
| ----| ---- | ------- | ------- | ---------- |
| 名前 | name | string | タグの名前 | "お知らせ" |

### schedules(スケジュール)

path: `schedules/{scheduleId}`
docId: google calender の ID
CFsのupdateSchedules関数にて取得される
| 論理名 | 物理名 | 型 | 説明 | サンプル |
| ----| ---- | ------- | ------- | ---------- |
| ID | id | string | ドキュメントID | 2hut6mofllmpqtl1vjf0ga1ugn |
| タイトル | title | string | スケジュールのタイトル | 【会員限定】アフタートークお給仕♡ |
| キャスト ID| castId | string | キャスト の ID | 2hut6mofllmpqtl1vjf0ga1ugn |
| タイプ| type | "None" \| "Holiday" \| "Canceled" \| "YouTube" \| "YouTubeAndLimitedAfter" \| "Twitcasting" \| "TwitcastingAndLimitedAfter" \| "LiveAction" \| "AfterTalk" \| "LimitedBefore" \| "LimitedOnly" | スケジュールの種別 | "YouTube" |
| 開始日時 | startAt | timestamp | スケジュールの開始日時 | 2021 年 4 月 1 日 10:00:00 UTC+9 |
| 終了日時 | endAt | timestamp | スケジュールの終了日時 | 2021 年 4 月 1 日 20:00:00 UTC+9 |
| URL | url | string | スケジュールの対象 URL | YouTube URL or ツイキャス URL or "" |
| ライブ中 | isActive | boolean? | 動画が配信中かどうか | true |
| YouYube動画 | youtubeVideo | YoutubeVideo? | casts/{castId}/youtubeVideos/{youtubeVideoId}のデータが入る | スケジュールの対象 YouTube 動画情報 |  |
| ライブ配信 | livestreaming | { id: string; title: string; thumbnailUrl: string; status: LivestreamingStatus; }? | casts/{castId}/youtubeVideos/{youtubeVideoId}のデータが入る | 紐付いているライブ配信の情報 |  |

### users(ユーザー)

path: `users/{uid}`
docId: Firebase Authにて生成されるID
| 論理名 | 物理名 | 型 | 説明 | サンプル |
| ---------- | ------------- | -------- | -------------- | ------------- |
| ユーザーID | uid | string | ユーザーのID | "6lK9I7XYI6gXTHoYz3vunfQiEbM2" |
| 名前 | displayName | string | ユーザーの名前 Firebase Authに保存されているdisplayNameと等しい | "ユーザー" |
| メールアドレス | email | string | ユーザーのメールアドレス Firebase Authに保存されているemailと等しい | "example@test.com" |
| アバターURL | avatarUrl | string | ユーザーのアバター画像 Firebase Authに保存されているphotoURLと等しい | "https://lh3.googleusercontent.com/a-/AOh14GgKsezkDr5mC-S-qHhNASqmEH8XYWVuHdyRqcra=s96-c" |
| 権限 | role | "diamond" \| "platinum" \| "gold" \|"silver" \| "bronze" \| "normal" | ユーザーの権限 | "admin" |
| 誕生日 | dateOfBirth | string? | ユーザーの誕生日 | "1994-01-31T15:00:00.000Z" |
| 都道府県 | prefecture | string? | ユーザーの都道府県 | "tokyo" |
| 性別 | sex | ("male" \| "female" \| "other")? | ユーザーの性別 | "male" |
| DiscordID | discordId | string?  | ユーザーに紐づくDiscordID | "ユーザー#123" |
| 作成日時  | createdAt | timestamp | 作成日時  | 2019 年 4 月 1 日 0:00:00 UTC+9 |
| 更新日時  | updatedAt | timestamp | 更新日時  | 2019 年 4 月 1 日 0:00:00 UTC+9 |

### videos(動画)
path: `videos/{videoId}`
docId: 自動生成 (livestreamingから生成された場合はlivestreamingIdと同じ)
| 論理名     | 物理名  | 型      | 説明          | サンプル     |
| --------- | ------ | ------- | ------------ | ----------- |
| ID        | id    | string  | ドキュメントID | "nKni2e73rn1afd" |
| タイトル   | title | string | 動画のタイトル | "ありすちゃん実写お給仕10月09日" |
| 説明      | description | string | 動画の説明 | "ありすちゃんの実写お給仕です" |
| サムネイル URL | thumbnailUrl | string | サムネイルの画像のURL  | "https://storage.com/video/thumbnails/*** |
| 公開状況  | status | "Published" \| "Limited" \| "Private" | 公開状況 Published: 公開 Limited: 限定公開 Privete: 非公開 | Published |
| 種類      | type | "LiveAction" \| "AfterTalk" \| "Other" \| null | 動画の種類 LiveAction: 実写お給仕 AfterTalk: アフタートーク Other: その他 | "AfterTalk" |
| 視聴に必要なロール | requiredRole     | "diamond" \| "platinum" \| "gold" \|"silver" \| "bronze" \| null   | 動画を視聴できるロール | "diamond"  |
| 視聴期限 | expiredAt | Record<role, string \| null> \| null | 各ロールの視聴期限 | {gold: 2021年10月9日 15:10:18 UTC+9,silver: 2021年10月9日 15:10:18 UTC+9} |
| 動画の長さ | duration  | number?   | 動画の長さを秒数で表す | 7250.686198  |
| ライブ配信かどうか | wasLivestreaming     | boolean    | ライブ配信のアーカイブかどうか | true  |
| キャストID | castId     | string?    | キャストのID | 001-nekota-pepero  |
| 公開日時  | publishedAt | timestamp | 作成日時  | 2021年10月1日 15:10:18 UTC+9 |
| 作成日時  | createdAt | timestamp | 作成日時  | 2021年10月1日 15:10:18 UTC+9 |
| 更新日時  | updatedAt | timestamp | 更新日時  | 2021年10月1日 15:10:18 UTC+9 |

### videoCredentials(認証情報)
path: `videos/{videoId}/videoCredentials/{credentialType}`  
docId: "info"

### videoCredentials/info(動画情報)
path: `videos/{videoId}/videoCredentials/info`
docId: "info"
rules: read: if isAdminAuthenticated() || request.auth.token.role in resource.data.allowedRoles || 'none' in resource.data.allowedRoles;
| 論理名     | 物理名  | 型      | 説明          | サンプル     |
| --------- | ------ | ------- | ------------ | ----------- |
| URL        | url    | string  | 動画のURL | "https://~~~" |
| 許可されたロール | allowedRoles | string[] | 視聴可能なロール | ["diamond", "platinum"] |
