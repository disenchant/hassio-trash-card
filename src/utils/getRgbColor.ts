import Color from 'color';

const getRgbColor = (color: string) => {
  if ([ 'primary', 'accent' ].includes(color)) {
    return `var(--rgb-${color}-color)`;
  }

  if (color.startsWith('#')) {
    try {
      const c = new Color(color);

      return `${c.red()}, ${c.green()}, ${c.blue()}`;
    } catch {
      // ignore
    }
  }

  return `var(--rgb-${color})`;
};

export {
  getRgbColor
};
