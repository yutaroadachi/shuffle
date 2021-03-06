import copy from "copy-to-clipboard";
import { useCallback, useEffect, useState } from "preact/hooks";

export const App = () => {
  const { input, urlForCopy, result, onChangeInput, shuffle } = useApp();
  const { hasCopied: hasCopiedUrlForCopy, onCopy: onCopyUrlForCopy } =
    useClipboard(urlForCopy);
  const { hasCopied: hasCopiedResult, onCopy: onCopyResult } =
    useClipboard(result);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-purple-600">
      <header className="pt-8">
        <h1 className="font-bold text-4xl text-center">
          <a href="/">Shuffle</a>
        </h1>
      </header>
      <main className="flex flex-col flex-grow">
        <div className="w-full max-w-3xl px-4 py-8 mx-auto">
          <div className="p-4 border-2 border-purple-600 rounded">
            <div className="font-bold">使い方</div>
            <ul className="list-disc list-inside text-sm mt-2 ml-4">
              <li>
                入力欄にシャッフルしたい文字列を改行区切りで入力して実行ボタンを押してください
              </li>
              <li>
                <code>?q=hoge-huga</code>&nbsp;
                のようなハイフン区切りのクエリパラメータ付きでURLを開くと初期値が設定されます
              </li>
            </ul>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-8">
            <div>
              <label for="input" className="font-bold">
                入力
              </label>
              <br />
              <textarea
                id="input"
                value={input}
                onChange={onChangeInput}
                autofocus
                rows={10}
                className="w-80 p-4 mt-2"
              />
            </div>
            <button
              onClick={() => shuffle(input)}
              className="bg-purple-600 hover:bg-purple-500 font-bold text-white px-4 py-2 border-b-4 hover:border-b-0 border-purple-900 hover:border-purple-800 rounded"
            >
              {result ? "再実行" : "実行"}
            </button>
            <div className="md:text-right">
              <label for="result" className="font-bold">
                結果
              </label>
              <br />
              <textarea
                id="result"
                value={result}
                readonly
                rows={10}
                className="w-80 p-4 mt-2"
              />
            </div>
          </div>
          <div className="md:flex md:justify-between mt-2">
            {urlForCopy && (
              <button
                onClick={onCopyUrlForCopy}
                className="text-sm text-purple-600 hover:text-purple-300 border-b border-purple-600 hover:border-purple-300"
              >
                {hasCopiedUrlForCopy
                  ? "コピーしました"
                  : "この入力を初期値とするURLをコピー"}
              </button>
            )}
            <br />
            {result && (
              <button
                onClick={onCopyResult}
                className="text-sm text-purple-600 hover:text-purple-300 border-b border-purple-600 hover:border-purple-300"
              >
                {hasCopiedResult ? "コピーしました" : "この結果をコピー"}
              </button>
            )}
          </div>
        </div>
      </main>
      <footer className="pb-8">
        <div className="text-center">
          Copyright© adachi All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

const useApp = () => {
  const [input, setInput] = useState("");
  const [urlForCopy, setUrlForCopy] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get("q");
    if (q) {
      const initialInput = q.split("-").join("\n");
      setInput(initialInput);

      const initialUrlForCopy = buildUrlForCopy(initialInput);
      setUrlForCopy(initialUrlForCopy);

      const initialResult = buildResult(initialInput);
      setResult(initialResult);
    }
  }, []);

  const onChangeInput = useCallback(
    (e: any) => {
      setInput(e.target.value);
    },
    [setInput]
  );
  const shuffle = useCallback(
    (input: string) => {
      const urlForCopy = buildUrlForCopy(input);
      setUrlForCopy(urlForCopy);

      const result = buildResult(input);
      setResult(result);
    },
    [setUrlForCopy, setResult]
  );

  return { input, urlForCopy, result, onChangeInput, shuffle };
};

const buildUrlForCopy = (input: string) => {
  if (!input) return "";

  const inputArray = inputStringToArray(input);
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  const q = inputArray.join("-");

  return `${url.href}?q=${q}`;
};

const buildResult = (input: string) => {
  if (!input) return "";

  const inputArray = inputStringToArray(input);
  const shuffledArray = shuffleArray(inputArray);

  return shuffledArray.join("\n");
};

const inputStringToArray = (input: string) => input.split(/\n|\r\n/);

/** @see https://qiita.com/pure-adachi/items/77fdf665ff6e5ea22128#%E3%83%80%E3%82%B9%E3%83%86%E3%83%B3%E3%83%95%E3%82%A7%E3%83%AB%E3%83%89%E3%81%AE%E6%89%8B%E6%B3%95 */
const shuffleArray = <T extends any>(array: T[]) => {
  let copiedArray = [...array];
  for (let i = copiedArray.length; i > 1; i--) {
    const k = Math.floor(Math.random() * i);
    [copiedArray[k], copiedArray[i - 1]] = [copiedArray[i - 1], copiedArray[k]];
  }

  return copiedArray;
};

/** @see https://github.com/chakra-ui/chakra-ui/blob/main/packages/hooks/src/use-clipboard.ts */
const useClipboard = (text: string) => {
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = useCallback(() => {
    const didCopy = copy(text);
    setHasCopied(didCopy);
  }, [text]);

  useEffect(() => {
    let timeoutId: number | null = null;

    if (hasCopied) {
      timeoutId = window.setTimeout(() => {
        setHasCopied(false);
      }, 1500);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [hasCopied]);

  return { value: text, hasCopied, onCopy };
};
