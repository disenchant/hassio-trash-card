import { css, html, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';
import { customElement } from 'lit/decorators.js';
import { CALENDAR_EVENT_TRACKER_NAME } from '../const';
import { defaultHaCardStyle } from '../../../utils/defaultHaCardStyle';
import { getColoredStyle } from '../../../utils/getColoredStyle';
import { daysTill } from '../../../utils/daysTill';
import { BaseItemElement } from './BaseItemElement';

@customElement(`${CALENDAR_EVENT_TRACKER_NAME}-icon-card`)
class IconCard extends BaseItemElement<{ nextEvent: boolean }> {
  public render () {
    if (!this.hass || !this.item || !this.config) {
      return nothing;
    }

    // eslint-disable-next-line prefer-destructuring
    const item = this.item;

    const style = {
      ...getColoredStyle([ 'icon', 'badge' ], item, this.parentElement, this.hass.themes.darkMode),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--mdc-icon-size': `${this.config.icon_size ?? 40}px`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '--calendar-event-tracker-icon-size': `${this.config.icon_size ?? 40}px`
    };

    const daysTillToday = Math.abs(daysTill(new Date(), item.date.start));
    const daysDiff = daysTill(new Date(), item.date.start);
    const { highlight_today, highlight_overdue } = this.config;
    const isTask = item.content?.entity?.startsWith('todo.');
    const isOverdue = !!(isTask && daysDiff < 0 && (highlight_overdue ?? true));

    const cssClasses = {
      today: daysTillToday === 0 && (highlight_today ?? true) && !isOverdue,
      tomorrow: daysTillToday === 1 && !isOverdue,
      another: daysTillToday > 1 && !isOverdue,
      overdue: isOverdue,
      nextEvent: this.item.nextEvent,
      futureEvent: !this.item.nextEvent
    };

    const pictureUrl = this.getPictureUrl();

    this.withBackground = true;

    const cardStyle = {
      ...style,
      cursor: isTask ? 'pointer' : 'default'
    };

    return html`
      <ha-card style=${styleMap(cardStyle)} class=${classMap(cssClasses)} @click=${this.handleTaskClick}>
          <div class="container">
          <div class="content">
          <div class="icon-container">
          ${pictureUrl ?
    this.renderPicture(pictureUrl) :
    html`<ha-icon .icon=${this.item.icon} .hass=${this.hass}></ha-icon>`
}
              </div>
          </div>
        </div>
        <span class="badge" >${daysTillToday}</span>
      </ha-card>
    `;
  }

  public static get styles () {
    return [
      defaultHaCardStyle,
      css`
        :host {
          --ha-card-border-width: 0px;
          --ha-card-background: transparent;
        }
        ha-card {
          display: grid;
        }
        ha-card.today .badge {
          border: 2px solid var(--primary-text-color);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        ha-card.overdue .badge {
          border: 2px solid var(--error-color, #db4437);
          background-color: var(--error-color, #db4437);
          color: white;
          box-shadow: 0 0 10px rgba(219, 68, 55, 0.4);
          animation: pulse 2s infinite;
        }
        .content {
          justify-content: space-around;
          display: flex;
        }
        .icon-container {
          margin-bottom: 5px;
          display: block;
        }
        .badge {
          display: inline-grid;
          border-radius: 15px;
          background-color: var(--badge-color);
          color: var(--primary-text-color);
          overflow: hidden;
          font-size: 80%;
          text-align: center;
          width: fit-content;
          padding: 0 1em;
          justify-self: center;
          border: none;
          box-shadow: var(--chip-box-shadow);
          box-sizing: content-box;
        }
        hui-image {
          height: var(--calendar-event-tracker-icon-size);
        }
      `
    ];
  }
}

export {
  IconCard
};
