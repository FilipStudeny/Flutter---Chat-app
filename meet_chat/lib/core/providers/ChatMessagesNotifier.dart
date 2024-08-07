import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:meet_chat/core/globals.dart';
import 'package:meet_chat/core/models/Message.dart';
import 'package:meet_chat/core/services/MessagingService.dart';

class ChatMessagesNotifier extends StateNotifier<List<Message>> {
  final IMessagingService messagingService;
  final String userId;
  final String recipientId;
  Map<String, dynamic>? lastMessageData; // To keep track of the last message data for pagination
  bool isLoadingMore = false; // To prevent multiple simultaneous loads
  bool loading = true; // Loading state
  final int limit; // Message limit

  ChatMessagesNotifier(this.messagingService, this.userId, this.recipientId, {this.limit = 20}) : super([]) {
    _loadInitialMessages();
  }

  Future<void> _loadInitialMessages() async {
    final messagesStream = messagingService.loadMessages(userId, recipientId, limit: limit);
    messagesStream.listen((messages) {
      state = messages; // Maintain the order
      if (messages.isNotEmpty) {
        lastMessageData = messages.last.toMap();
      }
      loading = false;
    });
  }

  Future<bool> loadMoreMessages() async {
    if (isLoadingMore || lastMessageData == null) return false;
    isLoadingMore = true;

    try {
      await Future.delayed(Duration(seconds: 2)); // Simulating network delay
      final moreMessages = await messagingService.loadMoreMessages(userId, recipientId, lastMessageData!, limit: limit);
      if (moreMessages.isNotEmpty) {
        lastMessageData = moreMessages.last.toMap();
        state = [...state, ...moreMessages]; // Append at the end
        return moreMessages.length == limit;
      }
      return false;
    } catch (e) {
      print('Error loading more messages: $e');
      return false;
    } finally {
      isLoadingMore = false;
    }
  }
}

final chatMessagesProvider = StateNotifierProvider.family<ChatMessagesNotifier, List<Message>, String>((ref, recipientId) {
  final userId = FirebaseAuth.instance.currentUser!.uid;
  final messagingService = ref.read(messagingServiceProvider);
  return ChatMessagesNotifier(messagingService, userId, recipientId, limit: 10);
});

final messagingServiceProvider = Provider<IMessagingService>((ref) {
  return INJECTOR<IMessagingService>();
});
