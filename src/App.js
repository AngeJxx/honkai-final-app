import React, { useState, useEffect, useRef } from 'react';

// =================================================================
// 步骤 1: 引入所有需要的工具和图标
// =================================================================
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection, query, orderBy, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { Shield, Users, BrainCircuit, Bot, Star, Swords, Zap, Wind, Flame, Snowflake, Dna, Leaf, Sparkles, LoaderCircle, Camera, Upload, LogOut, Database } from 'lucide-react';

// =================================================================
// 步骤 2: 填入您的Firebase配置信息
// 您可以从之前上传的截图 (858ab454....jpg) 中找到这些信息
// =================================================================
const firebaseConfig = {
    apiKey: "AIzaSyBjQYBgvvhC7xUyCNH0P0dUK_Lj8qjkE0U",
    authDomain: "honkai-sr-helper-4fbd1.firebaseapp.com",
    projectId: "honkai-sr-helper",
    storageBucket: "honkai-sr-helper.appspot.com",
    messagingSenderId: "766114723569",
    appId: "1:766114723569:web:e2c78a83d4a151caba9b50"
};

// 初始化Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =================================================================
// 内置的深渊数据模板
// =================================================================
const abyssDataToSeed = {
    seasonId: "v1.0-initial",
    apocalypticShadow: {
        title: "末日幻影",
        buffTitle: "本期幻影",
        buffDescription: "我方角色施放终结技后，恢复2点能量，该效果每回合最多触发2次。当敌人进入弱点击破状态时，我方全体恢复10点能量。",
        boss: { name: "『往昔之影』", weaknesses: ["物理", "火", "虚数"], image: "https://placehold.co/150x150/2d3748/edf2f7?text=BOSS" },
        teams: [
            { name: "银枝物理队", chars: ["银枝", "停云", "花火", "藿藿"], strategy: "核心是通过高频充能让银枝快速启动180能量终结技，一击制胜。" },
            { name: "真理医生追击队", chars: ["真理医生", "托帕", "砂金", "知更鸟"], strategy: "利用高频追加攻击削韧，配合真理医生的终结技进行爆发。" }
        ]
    },
    pureFiction: {
        title: "虚构叙事",
        buffTitle: "本期戏言",
        buffDescription: "我方角色施放终结技攻击敌方目标后，会基于本次攻击造成的伤害，对目标附加【爆裂】效果，造成固定数值的伤害。该伤害可以暴击。",
        teams: [
            { name: "黑塔姬子追击队", chars: ["黑塔", "姬子", "阮•梅", "符玄"], strategy: "经典的清杂组合，利用追加攻击循环快速清理大量小怪。" },
            { name: "景元追击队", chars: ["景元", "停云", "花火", "藿藿"], strategy: "依靠神君的高额群伤进行清场，辅助提供极致充能和增伤。" },
            { name: "黄泉终结技队", chars: ["黄泉", "佩拉", "银狼", "加拉赫"], strategy: "通过队友施加负面效果为黄泉叠层，快速启动终结技。" }
        ]
    },
    memoryOfChaos: {
        title: "混沌回忆",
        buffTitle: "本期记忆紊流",
        buffDescription: "每轮开始时，场上所有敌方目标陷入【记忆印记】状态。携带【记忆印记】的目标受到我方角色普攻或战技伤害后，额外受到1次基于角色攻击力的附加伤害。",
        sections: [
            { name: "上半区", enemies: ["忆域迷因『何物为真』", "承露天人"], weaknesses: ["火", "风", "虚数"], teams: [
                { name: "黄泉虚无队", chars: ["黄泉", "佩拉", "桂乃芬", "符玄"], strategy: "利用桂乃芬和佩拉高效地为黄泉叠层，快速释放终结技清场。" },
                { name: "卡芙卡DOT队", chars: ["卡芙卡", "黑天鹅", "阮•梅", "藿藿"], strategy: "DOT队能无视敌人特定机制持续输出，利用紊流效果增加额外伤害。" }
            ]},
            { name: "下半区", enemies: ["『神主日』冈德拉姆", "金人勾魂使"], weaknesses: ["雷", "风", "量子"], teams: [
                { name: "景元追击队", chars: ["景元", "停云", "花火", "砂金"], strategy: "景元的神君是应对『神主日』分裂机制的优解，砂金保证生存。" },
                { name: "希儿量子队", chars: ["希儿", "银狼", "花火", "符玄"], strategy: "利用银狼植入弱点，配合希儿的再现机制快速清理杂兵。" }
            ]}
        ]
    }
};

// =================================================================
// 登录页面组件
// =================================================================
function LoginPage() { /* ... 此处省略登录页面的代码，和之前版本一样 ... */ }

// =================================================================
// 导入数据页面组件
// =================================================================
function SeedDataPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSeedDatabase = async () => {
        setIsLoading(true);
        setError('');
        setSuccess(false);
        try {
            // 在这里添加数据到数据库
            const dataToSave = {
                ...abyssDataToSeed,
                startDate: serverTimestamp() // 使用服务器时间作为排序依据
            };
            const collectionRef = collection(db, "abyssSeasons");
            await addDoc(collectionRef, dataToSave);
            setSuccess(true);
            // 成功后2秒自动刷新页面，加载新数据
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            setError('数据导入失败，请检查网络或联系支持。');
            console.error("Seed error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white p-4 animate-fade-in">
            <div className="w-full max-w-md bg-slate-800/50 p-8 rounded-2xl border border-slate-700 text-center">
                <Database className="w-16 h-16 mx-auto text-sky-400 mb-4" />
                <h2 className="text-3xl font-bold text-sky-300 mb-2">数据库初始化</h2>
                <p className="text-slate-400 mb-8">您的数据库是空的，请点击下方按钮添加初始深渊数据。</p>
                
                {success ? (
                    <div className="text-green-400 font-bold p-4 bg-green-900/50 rounded-lg">
                        导入成功！页面即将自动刷新...
                    </div>
                ) : (
                    <button 
                        onClick={handleSeedDatabase}
                        disabled={isLoading}
                        className="w-full py-3 text-lg bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading && <LoaderCircle className="animate-spin mr-2" />}
                        {isLoading ? '正在导入...' : '一键导入初始数据'}
                    </button>
                )}

                {error && <p className="text-red-400 text-center text-sm mt-4">{error}</p>}
            </div>
        </div>
    );
}

// =================================================================
// 主应用组件 (HonkaiStrategyApp)
// ... 此处省略主应用界面的代码，和之前版本一样 ...
// =================================================================

// =================================================================
// 最终的 App 组件，负责处理所有逻辑
// =================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [abyssData, setAbyssData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDbEmpty, setIsDbEmpty] = useState(false); // 新增状态，判断数据库是否为空

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const fetchAbyssData = async () => {
          setIsLoading(true);
          try {
            const q = query(collection(db, "abyssSeasons"), orderBy("startDate", "desc"), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              setAbyssData(querySnapshot.docs[0].data());
              setIsDbEmpty(false); // 数据库不为空
            } else {
              setIsDbEmpty(true); // 数据库为空
              console.log("数据库为空，需要初始化。");
            }
          } catch (error) { console.error("获取数据失败:", error); } 
          finally { setIsLoading(false); }
        };
        fetchAbyssData();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white text-xl">正在连接星核数据库...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }
  
  // 新增逻辑：如果用户已登录，但数据库是空的，显示数据导入页面
  if (user && isDbEmpty) {
    return <SeedDataPage />;
  }

  // 如果已登录，且数据已加载，显示主应用
  if (user && abyssData) {
    return <HonkaiStrategyApp abyssDataFromDB={abyssData} user={user} />;
  }

  // 其他加载中的情况
  return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white text-xl">正在处理...</div>;
}


// 注意：为了让这份代码更简洁，我省略了 LoginPage 和 HonkaiStrategyApp (及其所有子组件) 的具体实现。
// 您需要将您之前版本中的这些组件代码，也一并复制粘贴到这个文件里，才能让它完整运行。
