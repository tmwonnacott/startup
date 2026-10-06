import React from 'react';
import { Link } from 'react-router-dom';
import { PageFrame } from '../shared/pageFrame';

export function Rules() {
  return (
    <PageFrame className="rules-page" footer={<p>NeverWord © 2026</p>}>
      <main className="rules-main">
        <h2>How to Play</h2>
        <p>In NeverWord, your goal is to avoid spelling a real word, but don&apos;t spell a never-word. A never-word is a group of letters that can never become a word, like &quot;Qezx.&quot;</p>
        <p>You and your opponent take turns adding letters. The game ends when:</p>
        <p>1. Someone spells a real word and loses.</p>
        <p>2. Someone calls bluff. The opponent must write a real word that starts with the current letters. If they can&apos;t think of one, they lose.</p>
        <p>Example:</p>
        <p>Word: _ Player 1 submits "R"</p>
        <p>Word: R_ Player 2 submits "A"</p>
        <p>Word: RA_ Player 1 submits "S"</p>
        <p>Word: RAP_ Player 2 thinks of the word "Raspberry" and puts a "P"</p>
        <p>Now the current word is RASP, which the game detects as a real word, so Player 2 loses</p>
        <p>Important: Words like raspberry, basketball, etc. can't ever be made because they already contain a word as a prefix</p>
        <Link to="/" className="btn-primary">Back to Menu</Link>
      </main>
    </PageFrame>
  );
}
