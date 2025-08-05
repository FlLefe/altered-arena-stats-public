'use client';

export interface ResourceItem {
  name: string;
  description: string;
  url: string;
  backgroundImage?: string;
}

interface ResourceCardProps {
  title?: string;
  items: ResourceItem[];
}

export function ResourceCard({ title, items }: ResourceCardProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-all duration-200 hover:shadow-sm overflow-hidden h-32"
          >
            {/* Background image */}
            {item.backgroundImage && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-25 transition-opacity duration-200 group-hover:opacity-35"
                style={{ backgroundImage: `url(${item.backgroundImage})` }}
              />
            )}

            {/* Overlay for better readability */}
            {item.backgroundImage && <div className="absolute inset-0 bg-black/20" />}

            {/* Content */}
            <div className="relative space-y-2 h-full flex flex-col">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors drop-shadow-sm line-clamp-1">
                {item.name}
              </h4>
              <p className="text-sm text-foreground/90 leading-relaxed drop-shadow-sm line-clamp-2 flex-1">
                {item.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
