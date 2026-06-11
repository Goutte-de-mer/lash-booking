import ServiceCard from "./ServiceCard";

const services = [
  {
    title: "Pose complète volume russe",
    description:
      "Pose complète effet volume russe pour un regard intense et glamour.",
    duration: 75,
    price: 85,
    deposit: 40,
  },
  {
    title: "Pose complète naturelle",
    description:
      "Pose complète cil à cil pour un effet naturel et élégant au quotidien.",
    duration: 60,
    price: 65,
    deposit: 30,
  },
  {
    title: "Retouche",
    description:
      "Retouche sur pose existante. Idéale pour maintenir votre regard entre deux poses complètes.",
    duration: 45,
    price: 45,
    deposit: 20,
  },
];

export default function Services() {
  return (
    <section className="px-6 py-14">
      <div className="mb-16 text-center">
        <p className="text-primary mb-3 text-sm font-medium tracking-widest uppercase">
          Nos prestations
        </p>
        <h2 className="font-heading text-4xl font-bold md:text-5xl">
          Des soins <span className="text-primary italic">d'exception</span>
        </h2>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <ServiceCard key={i} {...service} />
        ))}
      </div>
    </section>
  );
}
