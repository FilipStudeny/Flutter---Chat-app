import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:meet_chat/components/AppHeader.dart';
import 'package:meet_chat/components/BottomAppBarComponent.dart';
import 'package:meet_chat/components/ErrorMessageWidget.dart';
import 'package:meet_chat/core/globals.dart';
import 'package:meet_chat/core/models/Notification.dart';
import 'package:meet_chat/core/models/UserModel.dart';
import 'package:meet_chat/core/providers/NotificationsProvider.dart';
import 'package:meet_chat/core/services/DatabaseService.dart';
import 'package:meet_chat/core/services/NotificationService.dart';
import 'package:meet_chat/routes/SwipePage.dart';
import 'package:meet_chat/routes/UserProfile.dart';
import 'package:timeago/timeago.dart' as timeago;

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({super.key});

  static const String route = "notifications";

  @override
  _NotificationsPageState createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late User? loggedInUser;
  UserModel? currentUserData;
  OverlayEntry? _currentOverlayEntry;

  final IDatabaseService _databaseService = INJECTOR<IDatabaseService>();
  final NotificationService _notificationService = NotificationService();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    getCurrentUser();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showErrorMessage(String message) {
    if (_currentOverlayEntry != null) {
      _currentOverlayEntry!.remove();
    }

    final overlayState = Overlay.of(context);
    final overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        top: 120,
        left: MediaQuery.of(context).size.width * 0.1,
        right: MediaQuery.of(context).size.width * 0.1,
        child: Material(
          color: Colors.transparent,
          child: ErrorMessageWidget(
            message: message,
            type: MessageType.warning,
            canClose: true,
          ),
        ),
      ),
    );

    _currentOverlayEntry = overlayEntry;
    overlayState.insert(overlayEntry);

    Future.delayed(const Duration(seconds: 3), () {
      if (_currentOverlayEntry == overlayEntry) {
        _currentOverlayEntry?.remove();
        _currentOverlayEntry = null;
      }
    });
  }

  Future<void> getCurrentUser() async {
    try {
      final user = FIREBASE_INSTANCE.currentUser;
      final userId = user?.uid;
      final databaseResponse =
      await _databaseService.getUser(userId.toString());

      if (databaseResponse.success == false) {
        setState(() {
          loggedInUser = user;
          currentUserData = null;
          _showErrorMessage("Error retrieving user data, try again.");
        });
      } else {
        setState(() {
          loggedInUser = user;
          currentUserData = databaseResponse.data;
        });
      }
    } catch (err) {
      setState(() {
        loggedInUser = null;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppHeader(
        title: 'Notifications',
        tabController: _tabController,
        tabs: const [
          Tab(text: 'All'),
          Tab(text: 'Messages'),
          Tab(text: 'Friend Requests'),
        ],
      ),
      body: Container(
        color: const Color(0xFFF0F0F0),
        child: SafeArea(
          child: TabBarView(
            controller: _tabController,
            children: [
              _buildNotificationsTab(userNotificationsProvider), // All notifications
              _buildNotificationsTab(messageNotificationsProvider), // Messages only
              _buildNotificationsTab(friendRequestNotificationsProvider), // Friend Requests only
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomAppBarComponent(
        buttons: [
          buildIconButton(
            icon: Icons.person,
            startColor: const Color.fromRGBO(43, 217, 254, 1.0),
            endColor: Colors.lightBlueAccent,
            onPressed: () {
              Navigator.pushNamed(context, UserProfile.route,
                  arguments: loggedInUser?.uid);
            },
          ),
          buildIconButton(
            icon: Icons.people,
            startColor: const Color(0xFFFF5F6D),
            endColor: Colors.pinkAccent,
            onPressed: () {
              Navigator.pushNamed(context, SwipePage.route);
            },
          ),
          buildIconButton(
            icon: Icons.settings,
            startColor: Colors.red,
            endColor: Colors.deepOrange,
            onPressed: () {
              // Navigator.pushNamed(context, SettingsPage.route);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationsTab(
      StreamProvider<List<UserNotification>> provider) {
    return Consumer(
      builder: (context, ref, child) {
        final notificationsAsyncValue = ref.watch(provider);

        return notificationsAsyncValue.when(
          data: (notifications) {
            if (notifications.isEmpty) {
              return const Center(
                child: Text('No notifications found.'),
              );
            }

            return ListView.builder(
              padding: const EdgeInsets.all(8.0),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notification = notifications[index];
                return Card(
                  color: Colors.white, // Set the background color to white
                  elevation: 4,
                  margin: const EdgeInsets.symmetric(vertical: 8.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: ListTile(
                    leading: _getNotificationIcon(notification.type),
                    title: Text(
                      notification.message,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    subtitle: Text(
                      timeago.format(notification.createdAt),
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                    trailing: _buildTrailingIcons(notification),
                  ),
                );
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, stack) {
            print('Error fetching notifications: $error');
            return Center(
              child: Text('Error: $error'),
            );
          },
        );
      },
    );
  }

  Widget _buildTrailingIcons(UserNotification notification) {
    if (notification.type == NotificationType.friendRequest) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: const Icon(Icons.check, color: Colors.green), // Accept
            onPressed: () {
              _addFriend(notification);
            },
          ),
          IconButton(
            icon: const Icon(Icons.close, color: Colors.red), // Decline
            onPressed: () {
              _deleteNotification(notification);
            },
          ),
        ],
      );
    } else {
      return const SizedBox.shrink(); // Return an empty widget
    }
  }

  void _addFriend(UserNotification notification) async {
    // Add friend logic
    await _databaseService.addFriend(
        notification.recipientId, notification.senderId);
    // Delete the notification after adding a friend
    await _notificationService.deleteNotificationById(
        notification.recipientId, notification.id);
    print('Added friend: ${notification.senderId}');
  }

  void _deleteNotification(UserNotification notification) async {
    // Delete the notification
    await _notificationService.deleteNotificationById(
        notification.recipientId, notification.id);
    print('Deleted notification: ${notification.id}');
  }

  Icon _getNotificationIcon(NotificationType type) {
    switch (type) {
      case NotificationType.message:
        return const Icon(Icons.message, color: Colors.blue);
      case NotificationType.friendRequest:
        return const Icon(Icons.person, color: Colors.orange); // Person icon
      case NotificationType.globalMessage:
        return const Icon(Icons.announcement, color: Colors.orange);
      default:
        return const Icon(Icons.notifications, color: Colors.grey);
    }
  }
}
