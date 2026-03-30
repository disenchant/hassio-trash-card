/* eslint-disable unicorn/filename-case */
import { LitElement, html, nothing } from 'lit';
import { state } from 'lit/decorators.js';
import { getPicture } from '../../../utils/getPicture';

import type { CalendarEventTrackerConfig } from '../calendar-event-tracker-config';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';

class BaseItemElement<T = {}> extends LitElement {
  @state() protected readonly item?: CalendarItem & T;

  @state() protected readonly hass?: HomeAssistant;

  @state() protected readonly config?: CalendarEventTrackerConfig;

  protected withBackground = false;

  protected getPictureUrl () {
    return getPicture(this.item!.picture, this.hass!);
  }

  protected async handleTaskClick() {
    if (!this.hass || !this.item || !this.item.content.entity?.startsWith('todo.')) {
      return;
    }

    const { entity, uid, summary, status } = this.item.content;
    const task_interval = this.item.task_interval;

    if (status === 'completed') {
      return;
    }

    await this.hass.callService('todo', 'update_item', {
      item: uid,
      status: 'completed'
    }, { entity_id: entity });

    if (task_interval && task_interval > 0) {
      const newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + task_interval);
      const dueString = newDueDate.toISOString().split('T')[0];

      await this.hass.callService('todo', 'add_item', {
        item: summary,
        due_date: dueString
      }, { entity_id: entity });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderPicture (pictureUrl: string) {
    return html`
    <hui-image
      .image=${pictureUrl}
      .hass=${this.hass}
      @click=${this.handleTaskClick}
    ></hui-image>`;
  }

  protected renderIcon () {
    const isTodo = this.item?.content.entity?.startsWith('todo.');
    
    return html`
      <ha-tile-icon @click=${this.handleTaskClick} style="cursor: ${isTodo ? 'pointer' : 'default'}">
        <ha-state-icon
          slot="icon"
          .icon=${this.item?.icon}
          .hass=${this.hass}
        ></ha-state-icon>
        ${isTodo ? html`<ha-tile-badge slot="badge" .icon=${this.item?.content.status === 'completed' ? 'mdi:check-circle' : 'mdi:circle-outline'}></ha-tile-badge>` : nothing}
      </ha-tile-icon>`;
  }
}

export {
  BaseItemElement
};
