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
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError("登录失败，请检查邮箱和密码或网络连接。");
            console.error("Login Error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white p-4 animate-fade-in">
        <div className="w-full max-w-md bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
            <h2 className="text-3xl font-bold text-sky-300 text-center mb-2">私人AI策略助手</h2>
            <p className="text-center text-slate-400 mb-8">请登录以访问</p>
            <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="text-sm font-bold text-slate-300 block mb-2">邮箱地址</label>
                <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="zensa11@gmail.com"
                className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-sky-500 focus:outline-none transition-colors"
                />
            </div>
            <div>
                <label className="text-sm font-bold text-slate-300 block mb-2">密码</label>
                <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-sky-500 focus:outline-none transition-colors"
                />
            </div>
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
            <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-lg bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading && <LoaderCircle className="animate-spin mr-2" />}
                {isLoading ? "登录中..." : "登录"}
            </button>
            </form>
        </div>
        </div>
    );
}

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
            const dataToSave = { ...abyssDataToSeed, startDate: serverTimestamp() };
            const collectionRef = collection(db, "abyssSeasons");
            await addDoc(collectionRef, dataToSave);
            setSuccess(true);
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
                    <div className="text-green-400 font-bold p-4 bg-green-900/50 rounded-lg">导入成功！页面即将自动刷新...</div>
                ) : (
                    <button onClick={handleSeedDatabase} disabled={isLoading} className="w-full py-3 text-lg bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">
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
// UI辅助函数和组件
// =================================================================
const getCharImage = (charName) => `https://placehold.co/80x80/1a202c/90cdf4?text=${encodeURIComponent(charName[0])}`;

const WeaknessIcon = ({ type }) => {
  const iconProps = { className: "w-5 h-5 inline-block mr-1", strokeWidth: 1.5 };
  switch (type) {
    case "物理": return <Swords {...iconProps} color="#FFFFFF" />;
    case "火": return <Flame {...iconProps} color="#F87171" />;
    case "冰": return <Snowflake {...iconProps} color="#93C5FD" />;
    case "雷": return <Zap {...iconProps} color="#A78BFA" />;
    case "风": return <Wind {...iconProps} color="#34D399" />;
    case "量子": return <Dna {...iconProps} color="#818CF8" />;
    case "虚数": return <Leaf {...iconProps} color="#FBBF24" />;
    default: return null;
  }
};

const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

const TeamCard = ({ team, abyssTitle, buffDescription }) => {
    const [strategy, setStrategy] = useState(team.strategy);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerateStrategy = async () => {
        setIsLoading(true); setError(null);
        const prompt = `你是一位《崩坏：星穹铁道》的资深玩家和策略分析师。请为以下队伍在特定的深渊环境中，生成一份详细的打法攻略。\n\n当前模式: ${abyssTitle}\n本期增益 (Buff): ${buffDescription}\n队伍配置: ${team.chars.join(', ')}\n\n请提供一份详细的打法思路，格式为要点列表。`;
        try {
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API 请求失败: ${response.statusText}`);
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-sky-300">$1</strong>');
                setStrategy(formattedText);
            } else { throw new Error("未能从AI获取有效回复。"); }
        } catch (e) {
            setError(`生成策略失败: ${e.message}`); setStrategy(team.strategy);
        } finally { setIsLoading(false); }
    };

    return (
        <div className="bg-slate-900/70 p-4 rounded-lg transition-all hover:bg-slate-800/80">
            <p className="font-semibold text-sky-300 text-lg mb-3">{team.name}</p>
            <div className="flex flex-wrap gap-3 mb-4">{team.chars.map(char => (<div key={char} className="text-center"><img src={getCharImage(char)} alt={char} className="rounded-full w-16 h-16 mx-auto border-2 border-slate-600 hover:border-sky-400 transition-all" /><span className="text-xs text-slate-300 mt-1 block">{char}</span></div>))}</div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <strong className="text-slate-100">打法思路:</strong>
                    <button onClick={handleGenerateStrategy} disabled={isLoading} className="flex items-center px-3 py-1 text-sm bg-sky-600/50 hover:bg-sky-500/50 text-sky-200 rounded-full transition-all disabled:bg-slate-600 disabled:cursor-not-allowed">
                        {isLoading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        {isLoading ? '生成中...' : '✨ AI生成详细策略'}
                    </button>
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: strategy }}/>
            </div>
        </div>
    );
};

const ApocalypticShadow = ({ data }) => ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in"><div className="lg:col-span-1 bg-slate-800/50 p-6 rounded-2xl border border-slate-700"><h3 className="text-xl font-bold text-amber-300 flex items-center mb-4"><Bot className="w-6 h-6 mr-2" />本期首领</h3><div className="text-center"><img src={data.boss.image} alt={data.boss.name} className="mx-auto rounded-full border-4 border-slate-600 mb-4" /><p className="text-lg font-semibold text-white">{data.boss.name}</p><div className="mt-2"><span className="text-slate-400">推荐弱点：</span>{data.boss.weaknesses.map(w => <span key={w} className="inline-flex items-center text-slate-300 mr-2"><WeaknessIcon type={w} /> {w}</span>)}</div></div></div><div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700"><h3 className="text-xl font-bold text-amber-300 flex items-center mb-4"><Users className="w-6 h-6 mr-2" />推荐阵容与思路</h3><div className="space-y-6">{data.teams.map((team, index) => <TeamCard key={index} team={team} abyssTitle={data.title} buffDescription={data.buffDescription} />)}</div></div></div>);
const PureFiction = ({ data }) => ( <div className="animate-fade-in bg-slate-800/50 p-6 rounded-2xl border border-slate-700"><h3 className="text-xl font-bold text-amber-300 flex items-center mb-4"><Users className="w-6 h-6 mr-2" />推荐阵容与思路</h3><div className="space-y-6">{data.teams.map((team, index) => <TeamCard key={index} team={team} abyssTitle={data.title} buffDescription={data.buffDescription} />)}</div></div>);
const MemoryOfChaos = ({ data }) => ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">{data.sections.map((section, index) => (<div key={index} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700"><h3 className="text-2xl font-bold text-sky-300 mb-4 pb-2 border-b-2 border-slate-700">{section.name}</h3><div className="mb-4"><p className="text-slate-400 font-semibold mb-2">主要敌人: <span className="text-slate-200">{section.enemies.join(', ')}</span></p><p className="text-slate-400 font-semibold">推荐弱点: {section.weaknesses.map(w => <span key={w} className="inline-flex items-center text-slate-300 ml-2"><WeaknessIcon type={w} /> {w}</span>)}</p></div><div className="space-y-6">{section.teams.map((team, teamIndex) => <TeamCard key={teamIndex} team={team} abyssTitle={data.title} buffDescription={data.buffDescription} />)}</div></div>))}</div>);
const LiveAnalysis = () => {
    const [image, setImage] = useState(null); const [preview, setPreview] = useState(''); const [analysis, setAnalysis] = useState(''); const [isLoading, setIsLoading] = useState(false); const [error, setError] = useState(''); const fileInputRef = useRef(null);
    const handleImageChange = (e) => { const file = e.target.files[0]; if (file && file.type.startsWith('image/')) { setImage(file); setPreview(URL.createObjectURL(file)); setAnalysis(''); setError(''); } };
    const handleAnalyze = async () => {
        if (!image) { setError('请先上传一张截图。'); return; }
        setIsLoading(true); setError(''); setAnalysis('');
        try {
            const base64Image = await fileToBase64(image); const prompt = `你是一位资深的《崩坏：星穹铁道》策略分析师。请仔细分析这张游戏截图。请根据图片内容，用清晰的要点格式提供你的分析和建议。`;
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }, { inlineData: { mimeType: "image/png", data: base64Image } }] }] };
            const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error(`API 请求失败: ${response.statusText}`);
            const result = await response.json();
            if (result.candidates && result.candidates.length > 0) { const text = result.candidates[0].content.parts[0].text; const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300">$1</strong>').replace(/-\s/g, '• '); setAnalysis(formattedText); } 
            else { throw new Error("未能从AI获取有效分析结果。"); }
        } catch (e) { setError(`分析失败: ${e.message}`); } finally { setIsLoading(false); }
    };
    return ( <div className="animate-fade-in bg-slate-800/50 p-6 rounded-2xl border border-slate-700"><input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" /><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><h3 className="text-xl font-bold text-amber-300 flex items-center mb-4">1. 上传游戏截图</h3><div className="w-full h-64 border-2 border-dashed border-slate-600 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-sky-400 hover:bg-slate-800/50 transition-all" onClick={() => fileInputRef.current.click()}>{preview ? <img src={preview} alt="截图预览" className="max-w-full max-h-full object-contain rounded-md" /> : <> <Upload className="w-16 h-16 text-slate-500 mb-2" /> <p className="text-slate-400">点击或拖拽截图到这里</p> <p className="text-xs text-slate-500 mt-1">(角色面板、深渊阵容等)</p> </>}</div><button onClick={handleAnalyze} disabled={!image || isLoading} className="w-full mt-4 flex items-center justify-center px-4 py-3 text-lg bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all disabled:bg-slate-600 disabled:cursor-not-allowed">{isLoading ? <LoaderCircle className="w-6 h-6 mr-3 animate-spin" /> : <Sparkles className="w-6 h-6 mr-3" />}{isLoading ? 'AI分析中...' : '2. 开始分析'}</button></div><div><h3 className="text-xl font-bold text-amber-300 flex items-center mb-4">3. AI分析报告</h3><div className="w-full h-[21.5rem] bg-slate-900/70 rounded-lg p-4 border border-slate-700 overflow-y-auto">{isLoading && <p className="text-slate-400">请稍候...</p>}{error && <p className="text-red-400">{error}</p>}{analysis ? <div className="text-slate-300 leading-relaxed whitespace-pre-line space-y-2" dangerouslySetInnerHTML={{ __html: analysis }} /> : !isLoading && <p className="text-slate-500">这里将显示AI生成的分析报告。</p>}</div></div></div></div>);
};


// =================================================================
// 主应用界面
// =================================================================
function HonkaiStrategyApp({ abyssDataFromDB, user }) {
    const [activeTab, setActiveTab] = useState('apocalypticShadow');
    const getBuffData = () => {
        if (activeTab === 'liveAnalysis') return { title: 'AI 实时分析', description: '上传您的游戏截图，让AI为您提供定制化的策略分析和优化建议。' };
        if (!abyssDataFromDB) return { title: '加载中...', description: '' };
        switch (activeTab) {
          case 'apocalypticShadow': return { title: abyssDataFromDB.apocalypticShadow.buffTitle, description: abyssDataFromDB.apocalypticShadow.buffDescription };
          case 'pureFiction': return { title: abyssDataFromDB.pureFiction.buffTitle, description: abyssDataFromDB.pureFiction.buffDescription };
          case 'memoryOfChaos': return { title: abyssDataFromDB.memoryOfChaos.buffTitle, description: abyssDataFromDB.memoryOfChaos.buffDescription };
          default: return { title: '', description: '' };
        }
    };
    const TabButton = ({ id, children }) => (<button onClick={() => setActiveTab(id)} className={`flex items-center px-3 py-2 text-sm md:px-5 md:py-3 md:text-base font-bold rounded-t-lg transition-all duration-300 border-b-4 ${activeTab === id ? 'bg-sky-500/20 border-sky-400 text-white' : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}>{children}</button>);
    return (
        <div className="bg-slate-900 min-h-screen text-white font-sans p-4 sm:p-6 lg:p-8 animate-fade-in">
            <style>{`.whitespace-pre-line { white-space: pre-line; } body { background-color: #0F172A; }`}</style>
            <header className="text-center mb-8 relative">
                <h1 className="text-4xl lg:text-5xl font-bold text-sky-300 tracking-wider">崩坏：星穹铁道 AI策略助手</h1>
                <p className="text-slate-400 mt-2">v6.0 (Seeder Edition) | 私人专属版</p>
                <div className="absolute top-0 right-0 flex flex-col items-center"><span className="text-xs text-slate-500 mb-1">{user.email}</span><button onClick={() => signOut(auth)} className="flex items-center text-sm text-slate-400 hover:text-sky-300 transition-colors"><LogOut className="w-4 h-4 mr-1" />退出</button></div>
            </header>
            <main className="max-w-7xl mx-auto">
                <div className="flex space-x-1 border-b border-slate-700 mb-6">
                    <TabButton id="apocalypticShadow"><Shield className="hidden sm:inline-block w-5 h-5 mr-2" />末日幻影</TabButton>
                    <TabButton id="pureFiction"><BrainCircuit className="hidden sm:inline-block w-5 h-5 mr-2" />虚构叙事</TabButton>
                    <TabButton id="memoryOfChaos"><Swords className="hidden sm:inline-block w-5 h-5 mr-2" />混沌回忆</TabButton>
                    <TabButton id="liveAnalysis"><Camera className="hidden sm:inline-block w-5 h-5 mr-2" />AI实时分析</TabButton>
                </div>
                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700 mb-6 animate-fade-in">
                    <h2 className="text-xl font-bold text-amber-300 flex items-center"><Star className="w-6 h-6 mr-2 text-amber-400" />{getBuffData().title}</h2>
                    <p className="text-slate-300 mt-2 text-base leading-relaxed">{getBuffData().description}</p>
                </div>
                <div>
                {(() => {
                    switch (activeTab) {
                        case 'apocalypticShadow': return <ApocalypticShadow data={abyssDataFromDB.apocalypticShadow} />;
                        case 'pureFiction': return <PureFiction data={abyssDataFromDB.pureFiction} />;
                        case 'memoryOfChaos': return <MemoryOfChaos data={abyssDataFromDB.memoryOfChaos} />;
                        case 'liveAnalysis': return <LiveAnalysis />;
                        default: return null;
                    }
                })()}
                </div>
            </main>
             <footer className="text-center mt-12 text-slate-500 text-sm"><p>本工具仅供策略参考，所有数据和图标版权归米哈游所有。</p><p>AI生成内容由Gemini提供，可能存在误差，请酌情参考。</p></footer>
        </div>
    );
}

// =================================================================
// 最终的 App 组件，负责处理所有逻辑
// =================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [abyssData, setAbyssData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDbEmpty, setIsDbEmpty] = useState(false);

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
              setIsDbEmpty(false);
            } else {
              setIsDbEmpty(true);
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

  if (isLoading) { return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white text-xl animate-pulse">正在连接星核数据库...</div>; }
  if (!user) { return <LoginPage />; }
  if (user && isDbEmpty) { return <SeedDataPage />; }
  if (user && abyssData) { return <HonkaiStrategyApp abyssDataFromDB={abyssData} user={user} />; }
  return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white text-xl">正在处理...</div>;
}
