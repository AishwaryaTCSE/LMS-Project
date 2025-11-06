const GlassCard = ({ title, value, icon }) => (
  <div className="glass-card flex flex-col items-center justify-center">
    {icon && <div className="text-4xl mb-2">{icon}</div>}
    <h3 className="text-white text-lg font-semibold">{title}</h3>
    <p className="text-white text-2xl mt-1">{value}</p>
  </div>
);

export default GlassCard;
