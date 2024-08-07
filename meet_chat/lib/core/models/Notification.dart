import 'package:cloud_firestore/cloud_firestore.dart';

enum NotificationType {
  message,
  friendRequest,
  globalMessage,
}

class UserNotification {
  final String senderId;
  final String recipientId;
  final String message;
  final NotificationType type;
  final DateTime createdAt;
  final String id;
  final bool read; // Add the 'read' property

  UserNotification({
    required this.senderId,
    required this.recipientId,
    required this.message,
    required this.type,
    required this.createdAt,
    required this.id,
    this.read = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'senderId': senderId,
      'recipientId': recipientId,
      'message': message,
      'type': type.toString().split('.').last,
      'createdAt': Timestamp.fromDate(createdAt),
      'read': read,
    };
  }

  static UserNotification fromMap(Map<String, dynamic> map, String id) {
    return UserNotification(
      senderId: map['senderId'],
      recipientId: map['recipientId'],
      message: map['message'],
      type: NotificationType.values.firstWhere((e) => e.toString() == 'NotificationType.${map['type']}'),      createdAt: (map['createdAt'] as Timestamp).toDate(),
      id: id,
      read: map['read'] as bool? ?? false,
    );
  }
}