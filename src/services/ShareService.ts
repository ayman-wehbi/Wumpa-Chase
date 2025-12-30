import { Share, Platform, PermissionsAndroid } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { ShareResult } from '../types';

/**
 * ShareService
 *
 * Handles capturing level completion images and sharing them
 * via the native Android share sheet.
 */
class ShareService {
  /**
   * Save image to gallery
   *
   * @param viewRef - Reference to the ShareLevelImage component
   * @param levelName - Name of the level for filename
   * @returns ShareResult indicating success/failure
   */
  async saveToGallery(
    viewRef: React.RefObject<any>,
    levelName: string
  ): Promise<ShareResult> {
    try {
      // Validate viewRef
      if (!viewRef.current) {
        return {
          success: false,
          error: 'View reference is null',
        };
      }

      // Request storage permission on Android
      if (Platform.OS === 'android') {
        // Android 13+ (API 33+) uses READ_MEDIA_IMAGES
        // Android 12 and below uses WRITE_EXTERNAL_STORAGE
        const permission =
          Number(Platform.Version) >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission, {
          title: 'Storage Permission',
          message: 'App needs access to save images to your gallery',
          buttonPositive: 'OK',
        });

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          return {
            success: false,
            error: 'Storage permission denied',
          };
        }
      }

      // Capture the image
      const imageUri = await this.captureImage(viewRef);

      // Generate filename
      const timestamp = new Date().getTime();
      const filename = `Wumpletion_${levelName.replace(/\s+/g, '_')}_${timestamp}.png`;

      // Save to Pictures directory
      const destPath = `${RNFS.PicturesDirectoryPath}/${filename}`;

      // Copy file to Pictures
      await RNFS.copyFile(imageUri, destPath);

      // Cleanup temp file
      await this.cleanup(imageUri);

      console.log('Image saved to gallery:', destPath);
      return { success: true };
    } catch (error: any) {
      console.error('Save to gallery failed:', error);
      return {
        success: false,
        error: String(error),
      };
    }
  }

  /**
   * Main share function - captures the view and triggers share sheet
   *
   * @param viewRef - Reference to the ShareLevelImage component
   * @param levelName - Name of the level being shared
   * @returns ShareResult indicating success/failure/cancellation
   */
  async shareLevel(
    viewRef: React.RefObject<any>,
    levelName: string
  ): Promise<ShareResult> {
    try {
      // Validate viewRef
      if (!viewRef.current) {
        return {
          success: false,
          error: 'View reference is null',
        };
      }

      // Capture the image
      const imageUri = await this.captureImage(viewRef);

      // For Android, copy to external storage first for better sharing compatibility
      const shareableUri = await this.prepareForSharing(imageUri, levelName);

      // Share via native share sheet
      await this.shareImage(shareableUri, levelName);

      // Cleanup temp files
      await this.cleanup(imageUri);
      if (shareableUri !== imageUri) {
        await this.cleanup(shareableUri);
      }

      return { success: true };
    } catch (error: any) {
      // Check if user cancelled the share
      if (error.message && error.message.includes('cancel')) {
        await this.cleanup(error.imageUri);
        return {
          success: false,
          cancelled: true,
        };
      }

      console.error('Share failed:', error);
      return {
        success: false,
        error: String(error),
      };
    }
  }

  /**
   * Prepare image for sharing by copying to external storage on Android
   *
   * @param uri - Original image URI
   * @param levelName - Level name for filename
   * @returns URI of shareable image
   */
  private async prepareForSharing(uri: string, levelName: string): Promise<string> {
    if (Platform.OS === 'android') {
      try {
        const timestamp = new Date().getTime();
        const filename = `wumpletion_share_${timestamp}.png`;
        const destPath = `${RNFS.CachesDirectoryPath}/${filename}`;

        await RNFS.copyFile(uri, destPath);
        return destPath;
      } catch (error) {
        console.warn('Failed to prepare for sharing, using original URI:', error);
        return uri;
      }
    }
    return uri;
  }

  /**
   * Capture the view as a PNG image
   *
   * @param viewRef - Reference to the view to capture
   * @returns URI string of the captured image
   */
  private async captureImage(viewRef: React.RefObject<any>): Promise<string> {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.9,
        width: 1080,
        height: 1080,
      });

      return uri;
    } catch (error) {
      console.error('Image capture failed:', error);
      throw new Error(`Failed to capture image: ${error}`);
    }
  }

  /**
   * Share the captured image via native share sheet
   *
   * @param uri - URI of the image to share
   * @param levelName - Name of the level for the share message
   */
  private async shareImage(uri: string, levelName: string): Promise<void> {
    try {
      // Ensure file URI has proper prefix
      const fileUri = uri.startsWith('file://') ? uri : `file://${uri}`;

      console.log('Sharing image from:', fileUri);

      // On Android, Share.share with url works for images
      const shareOptions = {
        title: `${levelName} - Wumpletion`,
        message: `Check out my ${levelName} completion in Crash Bandicoot 4!`,
        url: fileUri,
      };

      const result = await Share.share(shareOptions);

      // Handle result
      if (result.action === Share.dismissedAction) {
        // User cancelled - throw error with imageUri for cleanup
        const error: any = new Error('User cancelled share');
        error.imageUri = uri;
        throw error;
      }

      // Successfully shared or sharedAction
      console.log('Share successful:', result);
    } catch (error) {
      console.error('Share sheet error:', error);
      throw error;
    }
  }

  /**
   * Delete the temporary image file
   *
   * @param uri - URI of the file to delete
   */
  private async cleanup(uri?: string): Promise<void> {
    if (!uri) return;

    try {
      // Remove file:// prefix if present
      const filePath = uri.replace('file://', '');

      // Check if file exists before attempting to delete
      const exists = await RNFS.exists(filePath);
      if (exists) {
        await RNFS.unlink(filePath);
        console.log('Temp file cleaned up:', filePath);
      }
    } catch (error) {
      // Don't throw - cleanup failure shouldn't affect share success
      console.warn('Failed to cleanup temp file:', error);
    }
  }
}

export default new ShareService();
