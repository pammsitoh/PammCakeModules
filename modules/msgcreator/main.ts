interface MSG_text {
	texts: string;
	space?: boolean;
}
export class MSG_Creator {
	texts: MSG_text[] = [];
	composite() {
		const str = [];
		for (let i = 0; i < this.texts.length; i++) {
			const t = this.texts[i];

			str.push({ translate: t.texts });

			if (!t.space) {
				str.push({ text: " " });
				continue;
			}
			if (i < this.texts.length - 1) {
				str.push({ text: "\n§r" });
			}
		}
		return str;
	}
	addText(text: string, space?: boolean) {
		this.texts.push({ texts: text, space: space });
		return this;
	}
}

// //ejemplo de Actionbar
// system.runInterval(() => {
// 	const player = world.getAllPlayers()[0];
// 	if (player) {
// 		const msg = new MSG_Creator();
// 		const block = player.getBlockFromViewDirection({ maxDistance: 10 })?.block;
// 		if (block) {
// 			msg.addText(`§3Looking at block:§r ${block.typeId}`, true);

// 			msg.addText(
// 				`§3location:§r x: ${block.location.x} y: ${block.location.y} z: ${block.location.z}`,
// 				true,
// 			);
// 		}
// 		msg.addText("finearts.this_is_a_test_text");

// 		player.onScreenDisplay.setActionBar(msg.composite());
// 	}
// }, 1); // 20 ticks = 1 second
