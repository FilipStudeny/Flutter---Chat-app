import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:meet_chat/core/models/Notification.dart';
import 'package:meet_chat/core/services/NotificationService.dart';

// Provide the notification service
final notificationServiceProvider = Provider<INotificationService>((ref) {
  return NotificationService();
});

// Provider for all notifications
final userNotificationsProvider = StreamProvider<List<UserNotification>>((ref) {
  final userId = FirebaseAuth.instance.currentUser?.uid;
  if (userId == null) {
    return Stream.value([]);
  }
  final notificationService = ref.read(notificationServiceProvider);
  return notificationService.loadUserNotifications(userId);
});

// Provider for message notifications
final messageNotificationsProvider = StreamProvider<List<UserNotification>>((ref) {
  final userId = FirebaseAuth.instance.currentUser?.uid;
  if (userId == null) {
    return Stream.value([]);
  }
  final notificationService = ref.read(notificationServiceProvider);
  return notificationService.loadUserNotificationsByType(
    userId,
    NotificationType.message,
  );
});

// Provider for friend request notifications
final friendRequestNotificationsProvider =
StreamProvider<List<UserNotification>>((ref) {
  final userId = FirebaseAuth.instance.currentUser?.uid;
  if (userId == null) {
    return Stream.value([]);
  }
  final notificationService = ref.read(notificationServiceProvider);
  return notificationService.loadUserNotificationsByType(
    userId,
    NotificationType.friendRequest,
  );
});

// Provider for global message notifications
final globalMessageNotificationsProvider =
StreamProvider<List<UserNotification>>((ref) {
  final userId = FirebaseAuth.instance.currentUser?.uid;
  if (userId == null) {
    return Stream.value([]);
  }
  final notificationService = ref.read(notificationServiceProvider);
  return notificationService.loadUserNotificationsByType(
    userId,
    NotificationType.globalMessage,
  );
});
