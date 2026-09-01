// وردة صغيرة بزاوية بطاقة الإحصائية، بنفس لغة الرسومات النباتية المستخدمة
// خلف الهيدر وبعض الأقسام (نفس تركيبة ساق + بتلات بيضاوية) - لكن هذي وردة
// مستقلة تمامًا عن تلك الرسومات (كلاسات خاصة بها، ما تتشارك أو تأثر عليهم).
// بالحالة العادية ما تظهر بتلاتها (بدون وردة ثابتة) - بس أول ما الماوس
// يمر على البطاقة (:hover عبر CSS بملف globals.css)، البتلات تظهر وحدة
// بعد وحدة من الأسفل للأعلى لحد ما الوردة تكتمل.
export function AnimatedStatFlower() {
  return (
    <span className="stat-flower" aria-hidden="true">
      <svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg">
        <path
          className="stat-flower-stem"
          d="M14 90 C 11 70, 15 48, 9 28"
          stroke="var(--pink-300)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <g className="stat-flower-petal stat-flower-petal-1">
          <ellipse cx="9" cy="28" rx="9" ry="6" fill="var(--teal-400)" transform="rotate(-30 9 28)" />
        </g>
        <g className="stat-flower-petal stat-flower-petal-2">
          <ellipse cx="14" cy="50" rx="8" ry="5" fill="var(--pink-300)" transform="rotate(-18 14 50)" />
        </g>
        <g className="stat-flower-petal stat-flower-petal-3">
          <ellipse cx="11" cy="72" rx="8.5" ry="5.5" fill="var(--teal-200)" transform="rotate(-24 11 72)" />
        </g>
      </svg>
    </span>
  );
}
