// ref: https://firebase.google.com/docs/auth/admin/errors?hl=ja
export const getAuthErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'ログイン時に入力したメールアドレスを入力してください。';
    case 'auth/email-already-in-use':
      return '既に登録済みのメールアドレスです。';
    case 'auth/invalid-action-code':
      return '無効なURLです。再度ログインを行ってください。';
    case 'auth/user-not-found':
      return 'メールアドレスかパスワードに誤りがあります。';
    case 'auth/wrong-password':
      return 'メールアドレスかパスワードに誤りがあります。';
    case 'auth/unregistered-user':
      return '追加されたアカウントでログインしてください。追加希望の場合は管理者へ問い合わせてください。';
    default:
      return '認証に失敗しました。';
  }
};
