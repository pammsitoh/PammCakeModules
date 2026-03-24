import { Dimension, Entity, Vector3 } from "@minecraft/server";

export class FloatingText {
    textEntity: undefined | Entity;
    dimension: Dimension;
    position: Vector3;
    startText: string;
    text: string;
    constructor(text: string, position: Vector3, dimension: Dimension) {
        this.text = text;
        this.startText = text;
        this.position = position;
        /** @type {Dimension} */
        this.dimension = dimension;

        this.textEntity = undefined;
        this.spawnText();
    }

    setText(text: string) {
        if (!this.valid()) return
        this.text = text;
        if (this.textEntity) {
            this.textEntity.nameTag = text;
        }
    }

    /**
     * Saves the start text
     */
    saveStartText() {
        this.textEntity?.setDynamicProperty("pcake_namespace:startText", this.text);
    }

    /**
     * Sets the text entity
     * @param {Entity} entity
     */
    setEntity(entity: Entity) {
        this.textEntity = entity;
    }

    /**
     * Spawns the text entity
     */
    spawnText() {
        this.textEntity = this.dimension.spawnEntity("pcake_namespace:floating_text", this.position);
        this.saveStartText();
        this.setText(this.text);
    }

    /**
     * Removes the text entity
     */
    removeEntity() {
        this.textEntity?.remove();
        this.textEntity = undefined;
    }

    valid() {
        return this.textEntity?.isValid;
    }
}