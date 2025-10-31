import React, { useState } from 'react';
import { Mic, RefreshCw, Sparkles } from 'lucide-react';

// カテゴリ定義をファイルトップに置いてリテラル型を作る
const CATEGORIES = ['年代', 'ジャンル', '先頭文字'] as const;
type Category = typeof CATEGORIES[number]; // '年代' | 'ジャンル' | '先頭文字'
type Odai = { category: Category | '特殊お題' | ''; value: string };

export default function KaraokeOdaiApp() {

  const [currentOdai, setCurrentOdai] = useState<Odai[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [isSpecialMode, setIsSpecialMode] = useState(false);
  const [showSpecialList, setShowSpecialList] = useState(false);
  const [usedSpecialOdai, setUsedSpecialOdai] = useState<string[]>([]);
  const [isSlowing, setIsSlowing] = useState(false);

  const odaiData: Record<Category, string[]> = {
    '年代': ['90年代', '2000年代', '2010年代', '2020年代', '自由'],
    'ジャンル': ['J-POP', 'アニソン', 'ロック', '自由'],
    '先頭文字': ['あ行', 'か行', 'さ行', 'た行', 'な行', 'は行', 'ま行', 'や行', 'ら行', 'わ行', '自由']
  };

  const specialOdai = [
    'タイトルが2文字',
    'タイトルが3文字',
    'タイトルが4文字',
    'タイトルが5文字',
    'タイトルに数字が含まれる',
    'タイトルに記号が含まれる（&！？等）',
    'アーティスト名が英語',
    'タイトルが全部ひらがな',
    'タイトルが全部カタカナ',
    'ひらがな・カタカナ・漢字すべて含む',
    'タイトルに2つ以上の英単語を含む',
    '曲名に動物を含む',
    '曲名に色が含まれる',
    'タイトルが漢字一文字',
    '男性アーティストの曲',
    '女性アーティストの曲',
    'メンバー2人のグループの曲',
    'メンバー3人のグループの曲',
    'メンバー4人のグループの曲',
    'メンバー5人のグループの曲',
    'タイトルに「歌/詩/唄/うた」を含む',
    'タイトルが「単語の単語」形式',
    '自分の前回の曲からしりとり',
    'シャウトする曲',
    'お題自由設定 or 再抽選',
    'DAMトップ50',
    '履歴にある曲'
  ];

  const generateOdai = () => {
    setIsSpinning(true);
    setIsSlowing(false);
    setRevealedIndices([]);
    setCurrentOdai([]);
    setIsSpecialMode(false);

  const rand = Math.random();
  let numConstraints: number;
    
    // 5%の確率で完全フリー
    if (rand < 0.05) {
      setTimeout(() => {
        setIsSlowing(true);
      }, 1500);
      
      setTimeout(() => {
        setIsSpinning(false);
        setIsSlowing(false);
        setCurrentOdai([{ category: '', value: '縛りなし' }]);
        setRevealedIndices([0]);
      }, 2500);
      return;
    }
    
    // お題の数を決定
    if (rand < 0.55) { // 50%
      numConstraints = 1;
    } else if (rand < 0.85) { // 30%
      numConstraints = 2;
    } else { // 15%
      numConstraints = 3;
    }

  const result: Odai[] = [];
  const categoriesList = CATEGORIES as readonly Category[];
    
    // ランダムに指定するカテゴリーを選択
  const selectedCategories: Category[] = [];
    while (selectedCategories.length < numConstraints) {
      const randomCategory = categoriesList[Math.floor(Math.random() * categoriesList.length)] as Category;
      if (!selectedCategories.includes(randomCategory)) {
        selectedCategories.push(randomCategory);
      }
    }
    
    // 各カテゴリーの値を設定（自由以外のみ追加）
    categoriesList.forEach((category: Category) => {
      if (selectedCategories.includes(category)) {
        const options = odaiData[category].filter(opt => opt !== '自由');
        const value = options[Math.floor(Math.random() * options.length)];
        result.push({ category, value });
      }
    });

    // お題が1つの場合は特殊お題を追加
    if (result.length === 1) {
      const availableOdai = specialOdai.filter(odai => !usedSpecialOdai.includes(odai));
      
      if (availableOdai.length === 0) {
        setUsedSpecialOdai([]);
        const randomSpecial = specialOdai[Math.floor(Math.random() * specialOdai.length)];
        setUsedSpecialOdai([randomSpecial]);
        result.push({ category: '特殊お題', value: randomSpecial });
      } else {
        const randomSpecial = availableOdai[Math.floor(Math.random() * availableOdai.length)];
        setUsedSpecialOdai([...usedSpecialOdai, randomSpecial]);
        result.push({ category: '特殊お題', value: randomSpecial });
      }
    }

    setTimeout(() => {
      setIsSlowing(true);
    }, 1500);

    setTimeout(() => {
      setIsSpinning(false);
      setIsSlowing(false);
      setCurrentOdai(result);
      
      result.forEach((_, index) => {
        setTimeout(() => {
          setRevealedIndices(prev => [...prev, index]);
        }, index * 500);
      });
    }, 2500);
  };

  const generateSpecialOdai = () => {
    setIsSpinning(true);
    setIsSlowing(false);
    setRevealedIndices([]);
    setCurrentOdai([]);
    setIsSpecialMode(true);

    // まだ使っていない特殊お題を取得
    const availableOdai = specialOdai.filter(odai => !usedSpecialOdai.includes(odai));
    
    // 全て使い切った場合はリセット
    if (availableOdai.length === 0) {
      setUsedSpecialOdai([]);
      const randomSpecial = specialOdai[Math.floor(Math.random() * specialOdai.length)];
      setUsedSpecialOdai([randomSpecial]);
      
      setTimeout(() => {
        setIsSlowing(true);
      }, 1500);
      
      setTimeout(() => {
        setIsSpinning(false);
        setIsSlowing(false);
        setCurrentOdai([{ category: '特殊お題', value: randomSpecial }]);
        setRevealedIndices([0]);
      }, 2500);
      return;
    }

    const randomSpecial = availableOdai[Math.floor(Math.random() * availableOdai.length)];
    setUsedSpecialOdai([...usedSpecialOdai, randomSpecial]);

    setTimeout(() => {
      setIsSlowing(true);
    }, 1500);

    setTimeout(() => {
      setIsSpinning(false);
      setIsSlowing(false);
      setCurrentOdai([{ category: '特殊お題', value: randomSpecial }]);
      setRevealedIndices([0]);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <style>{`
        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes flash {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(1.5) rotate(180deg);
          }
        }
        
        @keyframes spin-vertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-100%);
          }
        }
        
        @keyframes reel-spin {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        
        @keyframes reel-slow {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-25%);
          }
        }
        
        .animate-reel-spin {
          animation: reel-spin 0.15s linear infinite;
        }
        
        .animate-reel-slow {
          animation: reel-slow 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-600 rounded-full p-4">
              <Mic className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            カラオケお題
          </h1>
          <p className="text-sm text-slate-500">
            ボタンを押してお題をゲット
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 mb-6 min-h-[200px] flex items-center justify-center border border-slate-200">
          {isSpinning ? (
            <div className="text-center w-full">
              <div className="flex justify-center mb-4">
                <div className="w-48 h-32 bg-white rounded-lg border-2 border-slate-300 overflow-hidden relative">
                  <div className={`absolute inset-0 flex flex-col ${isSlowing ? 'animate-reel-slow' : 'animate-reel-spin'}`}>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-32 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-24 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-28 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-20 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-32 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-26 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-30 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-22 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-28 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-24 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-32 bg-slate-300 rounded-full"></div>
                    </div>
                    <div className="h-8 flex items-center justify-center px-4">
                      <div className="h-1 w-20 bg-slate-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-lg font-bold text-slate-600 animate-pulse">
                抽選中...
              </p>
            </div>
          ) : currentOdai.length > 0 ? (
            <div className="text-center w-full">
              <div className="space-y-3">
                {currentOdai.map((odai, index) => (
                  <div 
                    key={index} 
                    className="relative"
                  >
                    {revealedIndices.includes(index) && (
                      <>
                        {/* バン！エフェクト - 放射状の線 */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="absolute w-32 h-32 animate-ping opacity-0" style={{
                            animation: 'ping 0.5s cubic-bezier(0, 0, 0.2, 1)',
                            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, transparent 70%)'
                          }}></div>
                          <div className="absolute w-24 h-24" style={{
                            animation: 'spin 0.3s ease-out, flash 0.4s ease-out',
                            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(251, 191, 36, 0.8) 20deg, transparent 40deg, rgba(251, 191, 36, 0.8) 60deg, transparent 80deg, rgba(251, 191, 36, 0.8) 100deg, transparent 120deg, rgba(251, 191, 36, 0.8) 140deg, transparent 160deg, rgba(251, 191, 36, 0.8) 180deg, transparent 200deg, rgba(251, 191, 36, 0.8) 220deg, transparent 240deg, rgba(251, 191, 36, 0.8) 260deg, transparent 280deg, rgba(251, 191, 36, 0.8) 300deg, transparent 320deg, rgba(251, 191, 36, 0.8) 340deg, transparent 360deg)',
                            clipPath: 'polygon(50% 50%, 100% 0%, 100% 100%)',
                            opacity: 0
                          }}></div>
                        </div>
                        
                        {/* お題カード */}
                        <div 
                          className="bg-white rounded-lg p-4 shadow border border-slate-200"
                          style={{
                            animation: 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                          }}
                        >
                          {odai.category && (
                            <p className="text-xs font-semibold text-slate-600 mb-1">
                              {odai.category}
                            </p>
                          )}
                          <p className={`font-bold text-slate-800 ${odai.category ? 'text-lg' : 'text-2xl'}`}>
                            {odai.value}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              お題を生成してください
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={generateOdai}
            disabled={isSpinning}
            className="w-full bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-700 transition-all duration-200 shadow hover:shadow-md transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <RefreshCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            お題を生成
          </button>

          <div className="flex gap-2">
            <button
              onClick={generateSpecialOdai}
              disabled={isSpinning}
              className="flex-1 bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-amber-700 transition-all duration-200 shadow hover:shadow-md transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Sparkles className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              特殊お題
            </button>
            <button
              onClick={() => setShowSpecialList(!showSpecialList)}
              className="bg-amber-100 text-amber-700 font-semibold py-3 px-4 rounded-lg hover:bg-amber-200 transition-all duration-200"
            >
              一覧
            </button>
          </div>

          {showSpecialList && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h3 className="text-sm font-bold text-amber-800 mb-2">
                特殊お題一覧 ({specialOdai.length - usedSpecialOdai.length}/{specialOdai.length})
              </h3>
              <ul className="text-xs text-slate-700 space-y-1">
                {specialOdai.map((odai, index) => (
                  <li 
                    key={index} 
                    className={`flex items-start ${usedSpecialOdai.includes(odai) ? 'line-through text-slate-400' : ''}`}
                  >
                    <span className="text-amber-600 mr-2">•</span>
                    {odai}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              setCurrentOdai([]);
              setRevealedIndices([]);
              setIsSpecialMode(false);
              setUsedSpecialOdai([]);
            }}
            disabled={isSpinning}
            className="w-full bg-slate-200 text-slate-700 font-semibold py-2 px-6 rounded-lg hover:bg-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            リセット
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          <div className="mt-2 pt-2 border-t border-slate-200">
            <p>Created by Y.Owa</p>
            <a 
              href="https://github.com/y-owa/karaoke_odai_app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 underline"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}