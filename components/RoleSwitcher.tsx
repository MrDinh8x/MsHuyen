import React from 'react';
import type { Role } from '../types';

interface RoleSwitcherProps {
    role: Role;
    setRole: (role: Role) => void;
}

export default function RoleSwitcher({ role, setRole }: RoleSwitcherProps): React.ReactElement {
    const isStudent = role === 'student';

    return (
        <div className="mt-4 p-2 bg-slate-900/50 rounded-lg">
            <label className="block text-center text-xs text-slate-400 mb-2">Chế độ xem</label>
            <div className="relative flex w-full p-1 bg-slate-700 rounded-md">
                <span
                    className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-sky-500 shadow-md transition-transform duration-300 ease-in-out ${
                        isStudent ? 'translate-x-0' : 'translate-x-full'
                    }`}
                ></span>
                <button onClick={() => setRole('student')} className="relative z-10 w-1/2 text-center text-xs font-bold py-1">
                    Học sinh
                </button>
                <button onClick={() => setRole('teacher')} className="relative z-10 w-1/2 text-center text-xs font-bold py-1">
                    Giáo viên
                </button>
            </div>
        </div>
    );
}
