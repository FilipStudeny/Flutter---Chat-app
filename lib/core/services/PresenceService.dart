import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:meet_chat/core/globals.dart';

abstract class IUserPresenceService {
  void setPresence(bool isOnline);
  Stream<String> getPresenceStream(String userId);
  Stream<DateTime?> getLastOnlineStream(String userId);
}

class UserPresenceService implements IUserPresenceService {
  final FirebaseFirestore _firestore = FIREBASE_FIRESTORE;
  final FirebaseAuth _auth = FIREBASE_INSTANCE;

  UserPresenceService() {
    _auth.authStateChanges().listen((user) {
      if (user != null) {
        _setPresenceListeners(user.uid);
      }
    });
  }

  void _setPresenceListeners(String userId) {
    _firestore.collection('users').doc(userId).update({
      'presence': 'online',
      'lastOnline': FieldValue.serverTimestamp(),
    }).then((_) {
      _firestore.collection('users').doc(userId).snapshots().listen((snapshot) {
        if (snapshot.exists && snapshot.data()?['presence'] == 'offline') {
          _firestore.collection('users').doc(userId).update({
            'presence': 'offline',
            'lastOnline': FieldValue.serverTimestamp(),
          });
        }
      });
    }).catchError((error) {
      print('Error updating presence: $error');
    });
  }

  @override
  Future<void> setPresence(bool isOnline) async {
    final user = _auth.currentUser;
    if (user != null) {
      try {
        await _firestore.collection('users').doc(user.uid).set({
          'presence': isOnline ? 'online' : 'offline',
          'lastOnline': FieldValue.serverTimestamp(),
        }, SetOptions(merge: true));
      } catch (e) {
        print('Error setting presence: $e');
      }
    }
  }

  @override
  Stream<String> getPresenceStream(String userId) {
    return _firestore
        .collection('users')
        .doc(userId)
        .snapshots()
        .map((snapshot) => snapshot.data()?['presence'] ?? 'offline');
  }

  @override
  Stream<DateTime?> getLastOnlineStream(String userId) {
    return _firestore.collection('users').doc(userId).snapshots().map(
            (snapshot) => (snapshot.data()?['lastOnline'] as Timestamp?)?.toDate());
  }
}
