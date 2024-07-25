import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:meet_chat/core/models/Notification.dart';
import 'package:meet_chat/core/services/NotificationService.dart';

final notificationServiceProvider = Provider<INotificationService>((ref) {
  return NotificationService();
});

final userNotificationsProvider = StreamProvider<List<UserNotification>>((ref) {
  final userId = FirebaseAuth.instance.currentUser?.uid;
  if (userId == null) {
    return Stream.value([]);
  }
  final notificationService = ref.read(notificationServiceProvider);
  return notificationService.loadUserNotifications(userId);
});
