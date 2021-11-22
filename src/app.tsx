export const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-purple-600">
      <header className="py-4">
        <h1 className="font-bold text-4xl text-center">Shuffle</h1>
      </header>
      <main className="flex flex-col flex-grow">
        <div className="w-full max-w-3xl py-8 mx-auto">
          <p className="font-bold text-center">
            左の入力欄にシャッフルしたい文字列を改行区切りで入力して実行ボタンを押してください
          </p>
          <div className="flex justify-between items-center mt-4">
            <div>
              <label for="input" className="font-bold">
                入力
              </label>
              <br />
              <textarea
                id="input"
                autofocus
                rows={10}
                className="w-80 p-4 mt-2"
              />
            </div>
            <button className="bg-purple-600 hover:bg-purple-500 font-bold text-white px-4 py-2 border-b-4 hover:border-b-0 border-purple-900 hover:border-purple-800 rounded">
              実行
            </button>
            <div className="text-right">
              <label for="result" className="font-bold">
                結果
              </label>
              <br />
              <textarea
                id="result"
                readonly
                rows={10}
                className="w-80 p-4 mt-2"
              >
                hoge
              </textarea>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button className="text-sm text-purple-600 hover:text-purple-300 border-b border-purple-600 hover:border-purple-300">
              コピー
            </button>
          </div>
        </div>
      </main>
      <footer className="py-4">
        <div className="text-center">
          Copyright© adachi All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
