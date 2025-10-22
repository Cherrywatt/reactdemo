import { Beer } from "lucide-react";

const MenuSidebar = () => {
  const combos = [
    {
      id: 1,
      name: "Balde de 10 Cerveza Polar Light",
      price: "$6.00",
      points: "850 Bs",
    },
    {
      id: 2,
      name: "5 Latas Polar Light / Solera Azul",
      price: "$4.00",
      points: "625 Bs",
    },
    {
      id: 3,
      name: "6 Latas Polar Light / Solera Azul",
      price: "$5.00",
      points: "750 Bs",
    },
    {
      id: 4,
      name: "1 Lata Polar Light / Solera Azul",
      price: "$1.00",
      points: "125 Bs",
    },
  ];

  return (
    <aside className="w-80 bg-card rounded-lg p-6 h-fit sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Beer className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold text-primary">MENÚ DEL ESTABLECIMIENTO</h2>
      </div>

      <h3 className="text-lg font-semibold text-accent mb-4">Combos Especiales</h3>

      <div className="space-y-4">
        {combos.map((combo) => (
          <div
            key={combo.id}
            className="bg-secondary border-l-4 border-primary rounded-lg p-4 hover:bg-secondary/80 transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <Beer className="w-5 h-5 text-primary mt-1" />
              <h4 className="font-semibold text-foreground flex-1">{combo.name}</h4>
            </div>
            <div className="flex items-center justify-between">
              <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                {combo.price}
              </span>
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                {combo.points}
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default MenuSidebar;
