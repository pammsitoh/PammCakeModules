import { world, system, EasingType, Player, Vector3 } from "@minecraft/server";

interface CameraKeyframe {
    position: Vector3;
    location?: Vector3; // Para usar facingLocation
    easeTime: number;
    easeType: EasingType;
}

export class CinematicCamera {
    keyFrames: CameraKeyframe[] = [];
    /**
     * @param position posicion donde esta el keyframe
     * @param duration duracion de la transicion
     * @param facingLocation  a donde mirara el player al hacer la animacion
     * @param animationType tipo de animacio / por defecto esta el InOutCubic
     * @returns la misma instancia de CinematicCamera para poder encadenar llamadas
     */
    addKeyframe(
        position: Vector3,
        duration: number,
        facingLocation?: Vector3,
        animationType?: EasingType,
    ) {
        if (this.keyFrames.length === 0) {
            // El primer keyframe no tiene easing, es la posición inicial
            this.keyFrames.push({
                position,
                location: facingLocation,
                easeTime: 0,
                easeType: EasingType.Linear,
            });
            return this;
        }

        const kf: CameraKeyframe = {
            easeTime: duration,
            easeType: animationType ?? EasingType.InOutCubic,
            position,
            location: facingLocation,
        };
        this.keyFrames.push(kf);
        return this;
    }
    /** muestra al player la animacion con los frames creados anteriormente */
    play(player: Player) {
        // Primer keyframe: posición inicial sin easing
        const first = this.keyFrames[0];
        player.camera.setCamera("minecraft:free", {
            location: first.position,
            facingLocation: first.location,
        });

        let delay = 0;

        for (let i = 1; i < this.keyFrames.length; i++) {
            const kf = this.keyFrames[i];
            delay += this.keyFrames[i - 1].easeTime * 20; // segundos a ticks

            system.runTimeout(() => {
                player.camera.setCamera("minecraft:free", {
                    location: kf.position,
                    easeOptions: {
                        easeTime: kf.easeTime,
                        easeType: kf.easeType,
                    },
                    facingLocation: kf.location,
                });
            }, delay);
        }

        // Limpiar cámara al terminar
        const totalTime = this.keyFrames.reduce(
            (sum, kf) => sum + kf.easeTime * 20,
            0,
        );
        system.runTimeout(() => {
            player.camera.clear();
        }, totalTime);
    }

    playForAll() {
        for (const player of world.getPlayers()) {
            this.play(player);
        }
    }
}
