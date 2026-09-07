import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';

export default function SlideDeck({slides, session}) {
  const [index, setIndex] = useState(0);
  const [presenter, setPresenter] = useState(false);
  const slide = slides[index];
  const go = (next) => setIndex((current) => Math.max(0, Math.min(slides.length - 1, current + next)));

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); go(1); }
      if (event.key === 'ArrowLeft' || event.key === 'Backspace') { event.preventDefault(); go(-1); }
      if (event.key.toLowerCase() === 'p') setPresenter((value) => !value);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [slides.length]);

  return (
    <main className={styles.deck}>
      <header className={styles.topbar}>
        <a href="/nestjs-course/" className={styles.back}>← Curso de NestJS</a>
        <span>{session}</span>
        <button type="button" onClick={() => setPresenter((value) => !value)}>Notas (P)</button>
      </header>
      <section className={styles.slide} aria-live="polite">
        <div className={styles.number}>0{index + 1}</div>
        <p className={styles.kicker}>{slide.kicker}</p>
        <h1>{slide.title}</h1>
        {slide.statement && <p className={styles.statement}>{slide.statement}</p>}
        {slide.code && <pre><code>{slide.code}</code></pre>}
        {slide.bullets && <ul>{slide.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
        {slide.diagram && <div className={styles.diagram}>{slide.diagram}</div>}
      </section>
      <footer className={styles.controls}>
        <button type="button" onClick={() => go(-1)} disabled={index === 0}>← Anterior</button>
        <span>{index + 1} / {slides.length}</span>
        <button type="button" onClick={() => go(1)} disabled={index === slides.length - 1}>Siguiente →</button>
      </footer>
      {presenter && <aside className={styles.notes}><strong>Notas para quien presenta</strong><p>{slide.notes}</p></aside>}
    </main>
  );
}
