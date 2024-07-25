import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:meet_chat/core/globals.dart';
import 'package:meet_chat/core/models/Notification.dart';
import 'package:meet_chat/core/models/ServiceResponse.dart';

abstract class INotificationService {
  Future<ServiceResponse<void>> createNotification(
      String senderId, String recipientId, String message, NotificationType type);

  Future<void> markNotificationAsRead(String userId, String notificationId);

  Future<void> deleteOldNotifications(String userId);

  Stream<List<UserNotification>> loadUserNotifications(String userId);
}

class NotificationService implements INotificationService {
  final FirebaseFirestore _firestore = FIREBASE_FIRESTORE;

  @override
  Future<ServiceResponse<void>> createNotification(
      String senderId, String recipientId, String message, NotificationType type) async {
    try {
      final newNotification = UserNotification(
        senderId: senderId,
        recipientId: recipientId,
        message: message,
        type: type,
        createdAt: DateTime.now(),
        id: '',
      );

      await _firestore
          .collection('users')
          .doc(recipientId)
          .collection('notifications')
          .add(newNotification.toMap());

      return ServiceResponse<void>(data: null, success: true);
    } on Exception catch (err) {
      return ServiceResponse<void>(data: null, message: err.toString(), success: false);
    }
  }

  @override
  Future<void> markNotificationAsRead(String userId, String notificationId) async {
    try {
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('notifications')
          .doc(notificationId)
          .update({'read': true});
    } catch (e) {
      print('Error marking notification as read: $e');
    }
  }

  @override
  Future<void> deleteOldNotifications(String userId) async {
    try {
      final now = DateTime.now();
      final thirtyDaysAgo = now.subtract(Duration(days: 30));
      final query = await _firestore
          .collection('users')
          .doc(userId)
          .collection('notifications')
          .where('createdAt', isLessThan: Timestamp.fromDate(thirtyDaysAgo))
          .get();

      for (var doc in query.docs) {
        await _firestore
            .collection('users')
            .doc(userId)
            .collection('notifications')
            .doc(doc.id)
            .delete();
      }
    } catch (e) {
      print('Error deleting old notifications: $e');
    }
  }

  @override
  Stream<List<UserNotification>> loadUserNotifications(String userId) {
    return _firestore
        .collection('users')
        .doc(userId)
        .collection('notifications')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
      return snapshot.docs.map((doc) => UserNotification.fromMap(doc.data(), doc.id)).toList();
    });
  }
}
