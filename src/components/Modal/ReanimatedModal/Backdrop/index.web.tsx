import React, {useMemo} from 'react';
import {View} from 'react-native';
import Animated, {Easing, Keyframe} from 'react-native-reanimated';
import type {BackdropProps} from '@components/Modal/ReanimatedModal/types';
import {PressableWithoutFeedback} from '@components/Pressable';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import variables from '@styles/variables';
import CONST from '@src/CONST';

const easing = Easing.bezier(0.76, 0.0, 0.24, 1.0).factory();

function Backdrop({
    style,
    customBackdrop,
    onBackdropPress,
    animationInTiming = CONST.MODAL.ANIMATION_TIMING.DEFAULT_IN,
    animationOutTiming = CONST.MODAL.ANIMATION_TIMING.DEFAULT_OUT,
    isBackdropVisible,
    backdropOpacity = variables.overlayOpacity,
}: BackdropProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();

    const Entering = useMemo(() => {
        const FadeIn = new Keyframe({
            from: {opacity: 0},
            to: {
                opacity: 0.72,
                easing,
            },
        });

        return FadeIn.duration(animationInTiming);
    }, [animationInTiming]);

    const Exiting = useMemo(() => {
        const FadeOut = new Keyframe({
            from: {opacity: 0.72},
            to: {
                opacity: 0,
                easing,
            },
        });

        return FadeOut.duration(animationOutTiming);
    }, [animationOutTiming]);

    const backdropStyle = useMemo(
        () => ({
            opacity: backdropOpacity,
        }),
        [backdropOpacity],
    );

    if (!customBackdrop) {
        return (
            <PressableWithoutFeedback
                accessible
                accessibilityLabel={translate('modal.backdropLabel')}
                onPress={onBackdropPress}
                style={[styles.userSelectNone, styles.cursorAuto]}
                dataSet={{[CONST.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true}}
            >
                {isBackdropVisible && (
                    <Animated.View
                        style={[styles.modalBackdrop, backdropStyle, style]}
                        entering={Entering}
                        exiting={Exiting}
                    />
                )}
            </PressableWithoutFeedback>
        );
    }
    return (
        isBackdropVisible && (
            <Animated.View
                entering={Entering}
                exiting={Exiting}
                style={[styles.userSelectNone]}
                dataSet={{[CONST.SELECTION_SCRAPER_HIDDEN_ELEMENT]: true}}
            >
                <View style={[styles.modalBackdrop, backdropStyle, style]}>{!!customBackdrop && customBackdrop}</View>
            </Animated.View>
        )
    );
}

Backdrop.displayName = 'Backdrop';

export default Backdrop;
