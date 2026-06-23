import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: Crumb[];
}

/** Standard top band for internal pages: breadcrumb + title + subtitle. */
export function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="border-b border-line bg-bg">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Trilha de navegação" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              {breadcrumb.map((crumb, i) => (
                <Fragment key={`${crumb.label}-${i}`}>
                  {i > 0 && <ChevronRight className="size-3.5 shrink-0" aria-hidden />}
                  <li>
                    {crumb.to ? (
                      <Link to={crumb.to} className="transition-colors hover:text-brand-pink">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-ink" aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                </Fragment>
              ))}
            </ol>
          </nav>
        )}

        <h1 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-tight text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
      </div>
    </section>
  );
}
