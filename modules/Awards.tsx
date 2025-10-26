import React, { useState, useEffect } from 'react';
import type { AwardData } from '../types';
import { getUserAwards } from '../services/googleSheetService';

const Badge: React.FC<{ name: string; icon: React.ReactNode; description: string }> = ({ name, icon, description }) => (
  <div className="bg-slate-700/50 p-4 rounded-xl flex flex-col items-center text-center gap-2 transform hover:scale-105 transition-transform">
    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-sky-400 text-3xl">
      {icon}
    </div>
    <h4 className="font-bold text-white">{name}</h4>
    <p className="text-xs text-slate-400">{description}</p>
  </div>
);

export default function Awards(): React.ReactElement {
  const [awards, setAwards] = useState<AwardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAwards = async () => {
      setIsLoading(true);
      const data = await getUserAwards();
      setAwards(data);
      setIsLoading(false);
    };
    fetchAwards();
  }, []);

  if (isLoading || !awards) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-t-transparent border-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Thành tích của bạn</h2>
      
      {/* Weekly Cup */}
      <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
        <h3 className="font-bold text-lg text-sky-400 mb-2">🏆 Cúp đã nhận</h3>
        <p className="text-6xl font-black text-white drop-shadow-lg">{awards.cups}</p>
        <p className="text-sm text-slate-400 mt-2">Hoàn thành bài tập với điểm 100% để nhận thêm cúp!</p>
      </div>

      {/* Badges */}
      <div>
        <h3 className="font-bold text-lg text-sky-400 mb-4">🏅 Huy hiệu đã đạt được</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {awards.badges.map((badge, index) => (
            <Badge key={index} {...badge} />
          ))}
        </div>
      </div>
      
      {/* Certificate */}
      {awards.hasMonthlyCertificate && (
        <div className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 rounded-2xl p-6 text-center shadow-lg">
          <h3 className="font-bold text-2xl text-slate-900">🎉 CHÚC MỪNG! 🎉</h3>
          <p className="text-slate-800 mt-2 font-semibold">Bạn đã nhận được Giấy chứng nhận</p>
          <p className="text-3xl font-black text-white mt-2 drop-shadow-md">SIÊU NHÂN SỐ CỦA THÁNG</p>
          <p className="text-slate-800 mt-2">Giấy chứng nhận đã được gửi vào email của bạn. Hãy tiếp tục phát huy nhé!</p>
        </div>
      )}
    </div>
  );
}
