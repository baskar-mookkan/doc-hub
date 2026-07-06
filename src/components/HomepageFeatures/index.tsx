import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  accent: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Connected by Partners',
    accent: styles.accentCyan,
    description: (
      <>
        Guides and references for the Enterprise ecosystem — connecting design,
        manufacturing and retail across spaces for living.
      </>
    ),
  },
  {
    title: 'Built for Developers',
    accent: styles.accentBlue,
    description: (
      <>
        Clear, practical documentation that helps teams ship faster. Find what
        you need, when you need it, without the noise.
      </>
    ),
  },
  {
    title: 'Always evolving',
    accent: styles.accentPurple,
    description: (
      <>
        Kept current alongside our products and platforms, so the docs reflect
        how Enterprise works today — not last year.
      </>
    ),
  },
];

function Feature({title, accent, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.card}>
        <span className={clsx(styles.icon, accent)} aria-hidden="true" />
        <Heading as="h3" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardText}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
