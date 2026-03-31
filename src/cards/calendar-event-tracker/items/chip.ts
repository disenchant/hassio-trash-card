import { css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { getDateString } from '../../../utils/getDateString';
import { customElement } from 'lit/decorators.js';
import { CALENDAR_EVENT_TRACKER_NAME } from '../const';
import { getColoredStyle } from '../../../utils/getColoredStyle';
import { BaseItemElement } from './BaseItemElement';
import { classMap } from 'lit/directives/class-map.js';
import { daysTill } from '../../../utils/daysTill';

@customElement(`${CALENDAR_EVENT_TRACKER_NAME}-item-chip`)
class ItemChip extends BaseItemElement {
  public render () {
    if (!this.hass || !this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const item = this.item;

    const { color_mode, hide_time_range, day_style, day_style_format, with_label, highlight_today, highlight_overdue } = this.config;

    const style = {
      ...getColoredStyle(color_mode, item, this.parentElement, this.hass.themes.darkMode)
    };

    const content = getDateString(item, hide_time_range ?? false, day_style, day_style_format, this.hass);

    const daysTillToday = Math.abs(daysTill(new Date(), item.date.start));
    const daysDiff = daysTill(new Date(), item.date.start);
    const isTask = item.content?.entity?.startsWith('todo.');
    const isOverdue = !!(isTask && daysDiff < 0 && (highlight_overdue ?? true));

    const cssClasses = {
      today: daysTillToday === 0 && (highlight_today ?? true) && !isOverdue,
      tomorrow: daysTillToday === 1 && !isOverdue,
      another: daysTillToday > 1 && !isOverdue,
      overdue: isOverdue
    };

    const pictureUrl = this.getPictureUrl();

    this.withBackground = true;

    const badgeConfig = {
      ...this.config,
      show_name: true
    };

    const chipStyle = {
      ...style,
      cursor: isTask ? 'pointer' : 'default'
    };

    return html`
      <ha-badge
        .type="badge"
        .hass=${this.hass}
        .config=${badgeConfig}
        .imageStyle=${'square'}
        style=${styleMap(chipStyle)}
        class=${classMap(cssClasses)}
        .iconOnly=${!with_label && !content}
        .label=${with_label ? item.label : nothing}
        @click=${this.handleTaskClick}
      >
        ${pictureUrl ?
    html`<img slot="icon" src=${pictureUrl} aria-hidden />` :
    html`<ha-state-icon
            slot="icon"
            .hass=${this.hass}
            .icon=${item.icon}
          ></ha-state-icon>`}
        ${content}
      </ha-badge>`;
  }

  public static get styles () {
    return [
      css`
        img[slot="icon"] {
          object-fit: contain;
        }

        ha-badge.today {
          --ha-badge-border-color: var(--primary-text-color);
          --ha-badge-border-width: 2px;
          border: 2px solid var(--primary-text-color);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        
        ha-badge.overdue {
          --ha-badge-border-color: var(--error-color, #db4437);
          --ha-badge-border-width: 2px;
          border: 2px solid var(--error-color, #db4437);
          box-shadow: 0 0 10px rgba(219, 68, 55, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(219, 68, 55, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(219, 68, 55, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(219, 68, 55, 0);
          }
        }
      `
    ];
  }
}

export {
  ItemChip
};
