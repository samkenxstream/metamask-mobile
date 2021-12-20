import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from 'react-native-actionsheet';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcon5 from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import Text from '../../Base/Text';
import { strings } from '../../../../locales/i18n';
import { colors } from '../../../styles/common';
import CollectibleMedia from '../CollectibleMedia';

const styles = StyleSheet.create({
	mediaButton: {
		borderWidth: 2,
		borderColor: colors.blue,
		borderStyle: 'dashed',
		borderRadius: 6,
		marginBottom: 20,
		height: 180,
	},
	gradient: {
		paddingHorizontal: 60,
		paddingVertical: 30,
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
	},
	indicator: {
		marginBottom: 5,
	},
	// eslint-disable-next-line react-native/no-color-literals
	media: {
		borderWidth: 0.5,
		borderColor: '#00000020',
		marginBottom: 12,
	},
});

const MediaSelector = ({ setMediaToSend, isLoading, selectedMedia }) => {
	const [media, setMedia] = useState(selectedMedia);
	const actionSheetRef = useRef();

	const handleChooseMedia = (index: number) => {
		switch (index) {
			case 1:
				launchCamera({ mediaType: 'photo' }, (response: ImagePickerResponse) => {
					// eslint-disable-next-line no-console
					console.log(response);

					if (response?.assets) {
						setMedia(response.assets[0]);
						setMediaToSend(response.assets[0]);
					}
				});
				break;
			case 2:
				launchCamera({ mediaType: 'video' }, (response: ImagePickerResponse) => {
					// eslint-disable-next-line no-console
					console.log(response);

					if (response?.assets) {
						setMedia(response.assets[0]);
						setMediaToSend(response.assets[0]);
					}
				});
				break;
			case 3:
				launchImageLibrary({ mediaType: 'mixed' }, (response: ImagePickerResponse) => {
					// eslint-disable-next-line no-console
					console.log(response);

					if (response?.assets) {
						setMedia(response.assets[0]);
						setMediaToSend(response.assets[0]);
					}
				});
				break;
		}
	};

	return (
		<View>
			{media ? (
				<CollectibleMedia
					collectible={{
						name: 'NFT',
						tokenId: 1,
						address: '0x',
						image: media.uri,
						animation: media.uri,
					}}
					cover
					renderAnimation
					style={styles.media}
				/>
			) : (
				<TouchableOpacity style={styles.mediaButton} onPress={() => actionSheetRef.current?.show()}>
					<LinearGradient colors={[colors.white, colors.blue100]} style={styles.gradient}>
						{isLoading ? (
							<React.Fragment>
								<ActivityIndicator color={colors.blue} style={styles.indicator} />
								<Text small blue centered>
									{'Uploading...'}
								</Text>
							</React.Fragment>
						) : (
							<React.Fragment>
								<FontAwesomeIcon5
									name="file-image"
									size={36}
									color={colors.blue}
									style={styles.indicator}
								/>
								<Text small blue centered>
									{'Take a photo, video or select from your device’s media.'}
								</Text>
							</React.Fragment>
						)}
					</LinearGradient>
				</TouchableOpacity>
			)}
			<ActionSheet
				ref={actionSheetRef}
				title={'Select action'}
				options={[strings('wallet.cancel'), 'Take a photo', 'Record video', 'Select from gallery']}
				cancelButtonIndex={0}
				onPress={handleChooseMedia}
			/>
		</View>
	);
};

MediaSelector.propTypes = {
	setMediaToSend: PropTypes.func,
	selectedMedia: PropTypes.object,
	isLoading: PropTypes.bool,
};

export default MediaSelector;