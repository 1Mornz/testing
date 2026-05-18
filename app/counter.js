"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <div className="count" aria-live="polite">
        {count}
      </div>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Increase number
      </button>
    </div>
  );
}
