import clientApi from '@cdo/apps/code-studio/initApp/clientApi';

const LIBRARY_NAME = 'library.json';
export default class LibraryClientApi {
  constructor(channelId) {
    this.channelId = channelId;
    this.libraryApi = clientApi.create('/v3/libraries');
  }

  publish(library, onError, onSuccess) {
    this.libraryApi.put(
      this.channelId,
      JSON.stringify(library),
      LIBRARY_NAME,
      (error, data) => {
        if (error) {
          onError(error);
        } else {
          onSuccess(data);
        }
      }
    );
  }

  getLatest(onSuccess, onError) {
    this.libraryApi.fetch(
      this.channelId + '/' + LIBRARY_NAME,
      (error, data) => {
        if (data) {
          onSuccess(data);
        } else {
          onError(error);
        }
      }
    );
  }

  getVersion(versionId) {
    let library;
    this.libraryApi.fetch(
      this.channelId + '/' + LIBRARY_NAME + '?version=' + versionId,
      (error, data) => {
        if (data) {
          // in the future, responses will be passed back to the import dialog
          console.log('Library: ' + data);
        } else {
          // In the future, errors will be surfaced to the user in the import dialog
          console.warn('Error getting library: ' + error);
        }
      }
    );
    return library;
  }

  delete() {
    this.libraryApi.deleteObject(this.channelId + '/' + LIBRARY_NAME, error => {
      if (error) {
        // In the future, errors will be surfaced to the user in the libraries dialog
        console.warn('Error deleting library: ' + error);
      }
    });
  }

  getClassLibraries(onSuccess, onError) {
    // TODO: find all libraries published by other students in a classroom
    return undefined;
  }
}
