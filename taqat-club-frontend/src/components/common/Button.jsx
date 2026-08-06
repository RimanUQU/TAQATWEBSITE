export default function Button({ children, variant = 'primary', onClick, type = 'button', className = '' }) {
  const baseStyles = 'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm disabled:opacity-50';
  
  const variants = {
    primary: 'bg-[#D95F93] hover:bg-[#C94F85] text-white',
    secondary: 'bg-[#3E9694] hover:bg-[#2C888D] text-white',
    outline: 'border-2 border-[#D95F93] text-[#D95F93] hover:bg-[#FDF2F6]',
    ghost: 'bg-[#F2FBFA] text-[#3E9694] hover:bg-[#A5D9D6]',
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}