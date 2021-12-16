import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Text, View, ScrollView, StyleSheet, Image, InteractionManager, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StyledButton from '../../UI/StyledButton';
import { colors, fontStyles, baseStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import FadeOutOverlay from '../../UI/FadeOutOverlay';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { getTransparentOnboardingNavbarOptions } from '../../UI/Navbar';
import OnboardingScreenWithBg from '../../UI/OnboardingScreenWithBg';
import Device from '../../../util/device';
import { saveOnboardingEvent } from '../../../actions/onboarding';
import { connect } from 'react-redux';
import AnalyticsV2, { ANALYTICS_EVENTS_V2 } from '../../../util/analyticsV2';
import DefaultPreference from 'react-native-default-preference';
import { METRICS_OPT_IN } from '../../../constants/storage';

const IMAGE_3_RATIO = 215 / 315;
const IMAGE_2_RATIO = 222 / 239;
const IMAGE_1_RATIO = 285 / 203;

const styles = StyleSheet.create({
	scroll: {
		flexGrow: 1,
	},
	wrapper: {
		paddingVertical: 30,
		flex: 1,
	},
	title: {
		fontSize: 24,
		marginBottom: 12,
		color: colors.fontPrimary,
		justifyContent: 'center',
		textAlign: 'center',
		...fontStyles.bold,
	},
	subtitle: {
		fontSize: 14,
		lineHeight: 19,
		marginTop: 12,
		marginBottom: 25,
		color: colors.grey500,
		justifyContent: 'center',
		textAlign: 'center',
		...fontStyles.normal,
	},
	ctas: {
		paddingHorizontal: 40,
		paddingBottom: Device.isIphoneX() ? 40 : 20,
		flexDirection: 'column',
		alignItems: Device.isIpad() ? 'center' : undefined,
	},
	ctaWrapper: {
		width: Device.isIpad() ? Device.maxWidth : undefined,
		justifyContent: 'flex-end',
	},
	carouselImage: {},
	// eslint-disable-next-line react-native/no-unused-styles
	carouselImage1: {
		marginTop: 30,
	},
	carouselImageWrapper: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	circle: {
		width: 8,
		height: 8,
		borderRadius: 8 / 2,
		backgroundColor: colors.grey500,
		opacity: 0.4,
		marginHorizontal: 8,
	},
	solidCircle: {
		opacity: 1,
	},
	progessContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		marginVertical: 36,
	},
	tab: {
		marginHorizontal: 30,
	},
});

const onboarding_carousel_1 = require('../../../images/onboarding-carousel-1.png'); // eslint-disable-line
const onboarding_carousel_2 = require('../../../images/onboarding-carousel-2.png'); // eslint-disable-line
const onboarding_carousel_3 = require('../../../images/onboarding-carousel-3.png'); // eslint-disable-line

const carousel_images = [onboarding_carousel_1, onboarding_carousel_2, onboarding_carousel_3];

/**
 * View that is displayed to first time (new) users
 */
function OnboardingCarousel({ saveOnboardingEvent }) {
	const navigation = useNavigation();
	const { width: windowWidth, height: windowHeight } = useWindowDimensions();
	const [currentTab, setCurrentTab] = useState(1);
	const renderTabBar = useMemo(() => () => <View />, []);
	const isPortrait = windowHeight > windowWidth;

	const imagesDimensions = useMemo(() => {
		if (Device.isIpad()) {
			const width = isPortrait ? windowWidth / 2 : windowWidth / 4;
			return [
				{
					width,
					height: width * IMAGE_1_RATIO,
				},

				{
					width,
					height: width * IMAGE_2_RATIO,
				},
				{
					width,
					height: width * IMAGE_3_RATIO,
				},
			];
		}
		const IMG_PADDING = Device.isIphoneX() ? 100 : Device.isIphone5S() ? 180 : 200;

		return [
			{
				width: windowWidth - IMG_PADDING,
				height: (windowWidth - IMG_PADDING) * IMAGE_1_RATIO,
			},

			{
				width: windowWidth - IMG_PADDING,
				height: (windowWidth - IMG_PADDING) * IMAGE_2_RATIO,
			},
			{
				width: windowWidth - 60,
				height: (windowWidth - 60) * IMAGE_3_RATIO,
			},
		];
	}, [isPortrait, windowWidth]);

	const trackEvent = useCallback(
		(eventArgs) => {
			InteractionManager.runAfterInteractions(async () => {
				const metricsOptIn = await DefaultPreference.get(METRICS_OPT_IN);
				if (metricsOptIn) {
					AnalyticsV2.trackEvent(eventArgs);
				} else {
					saveOnboardingEvent(eventArgs);
				}
			});
		},
		[saveOnboardingEvent]
	);

	const onChangeTab = useCallback(
		(obj) => {
			setCurrentTab(obj.i + 1);
			trackEvent(ANALYTICS_EVENTS_V2.ONBOARDING_WELCOME_SCREEN_ENGAGEMENT, {
				message_title: strings(`onboarding_carousel.title${[obj.i + 1]}`, { locale: 'en' }),
			});
		},
		[trackEvent]
	);

	const onPressGetStarted = useCallback(() => {
		navigation.navigate('Onboarding');
		trackEvent(ANALYTICS_EVENTS_V2.ONBOARDING_STARTED);
	}, [navigation, trackEvent]);

	useEffect(() => trackEvent(ANALYTICS_EVENTS_V2.ONBOARDING_WELCOME_MESSAGE_VIEWED), [trackEvent]);

	return (
		<View style={baseStyles.flexGrow} testID={'onboarding-carousel-screen'}>
			<OnboardingScreenWithBg screen={'carousel'}>
				<ScrollView style={baseStyles.flexGrow} contentContainerStyle={styles.scroll}>
					<View style={styles.wrapper}>
						<ScrollableTabView
							key={isPortrait}
							style={styles.scrollTabs}
							renderTabBar={renderTabBar}
							onChangeTab={onChangeTab}
						>
							{['one', 'two', 'three'].map((value, index) => {
								const key = index + 1;
								const imgStyleKey = `carouselImage${key}`;
								return (
									<View key={key} style={baseStyles.flexGrow}>
										<View style={styles.tab}>
											<Text style={styles.title} testID={`carousel-screen-${value}`}>
												{strings(`onboarding_carousel.title${key}`)}
											</Text>
											<Text style={styles.subtitle}>
												{strings(`onboarding_carousel.subtitle${key}`)}
											</Text>
										</View>
										<View style={styles.carouselImageWrapper}>
											<Image
												source={carousel_images[index]}
												style={[
													styles.carouselImage,
													styles[imgStyleKey],
													imagesDimensions[index],
												]}
												resizeMode={'contain'}
												testID={`carousel-${value}-image`}
											/>
										</View>
									</View>
								);
							})}
						</ScrollableTabView>

						<View style={styles.progessContainer}>
							{[1, 2, 3].map((i) => (
								<View key={i} style={[styles.circle, currentTab === i ? styles.solidCircle : {}]} />
							))}
						</View>
					</View>
				</ScrollView>
				<View style={styles.ctas}>
					<View style={styles.ctaWrapper}>
						<StyledButton
							type={'normal'}
							onPress={onPressGetStarted}
							testID={'onboarding-get-started-button'}
						>
							{strings('onboarding_carousel.get_started')}
						</StyledButton>
					</View>
				</View>
			</OnboardingScreenWithBg>
			<FadeOutOverlay />
		</View>
	);
}

OnboardingCarousel.navigationOptions = ({ navigation }) => getTransparentOnboardingNavbarOptions(navigation);

OnboardingCarousel.propTypes = {
	/**
	 * Save onboarding event to state
	 */
	saveOnboardingEvent: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
	saveOnboardingEvent: (...eventArgs) => dispatch(saveOnboardingEvent(eventArgs)),
});

export default connect(null, mapDispatchToProps)(OnboardingCarousel);
