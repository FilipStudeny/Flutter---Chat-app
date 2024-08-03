import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:meet_chat/core/providers/UserProvider.dart';
import 'package:meet_chat/core/services/PresenceService.dart';
import 'package:meet_chat/routes/%5BAuth%5D/AuthPage.dart';
import 'package:meet_chat/routes/SearchPage.dart';
import 'package:meet_chat/core/providers/UserPresenceNotifier.dart';
import 'package:meet_chat/core/providers/NotificationsProvider.dart';
import 'package:meet_chat/routes/NotificationsPage.dart';

class AppHeader extends ConsumerWidget implements PreferredSizeWidget {
  final String title;
  final TabController? tabController;
  final List<Widget>? tabs;

  const AppHeader({
    super.key,
    required this.title,
    this.tabController,
    this.tabs,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userState = ref.watch(userProvider);
    final user = FirebaseAuth.instance.currentUser;
    final photoURL = userState.profilePictureUrl ?? user?.photoURL;
    final displayName = userState.username ?? user?.displayName;
    final notifications = ref.watch(userNotificationsProvider);

    return AppBar(
      flexibleSpace: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFF5F6D), Colors.pinkAccent],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
      ),
      title: Row(
        children: [
          if (photoURL != null)
            Stack(
              children: [
                CircleAvatar(
                  backgroundImage: NetworkImage(photoURL),
                ),
                Positioned(
                  right: 0,
                  bottom: 0,
                  child: StreamBuilder<String>(
                    stream: UserPresenceService().getPresenceStream(user!.uid),
                    builder: (context, snapshot) {
                      final presence = snapshot.data ?? 'offline';
                      return CircleAvatar(
                        radius: 6,
                        backgroundColor: presence == 'online'
                            ? Colors.green
                            : Colors.red,
                      );
                    },
                  ),
                ),
              ],
            ),
          const SizedBox(width: 10),
          if (user != null)
            Text(
              displayName.toString(),
              style: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.bold),
            ),
        ],
      ),
      bottom: (tabController != null && tabs != null)
          ? TabBar(
        indicatorColor: Colors.amberAccent,
        controller: tabController,
        tabs: tabs!,
      )
          : null,
      actions: <Widget>[
        if (user != null)
          IconButton(
            icon: const Icon(Icons.search, color: Colors.white),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SearchPage()),
              );
            },
          ),
        Stack(
          alignment: Alignment.center,
          children: [
            IconButton(
              icon: const Icon(Icons.notifications, color: Colors.white),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const NotificationsPage(),
                  ),
                );
              },
            ),
            notifications.when(
              data: (data) {
                int unreadCount =
                    data.where((notification) => !notification.read).length;
                return unreadCount > 0
                    ? Positioned(
                  right: 8,
                  top: 8,
                  child: GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const NotificationsPage(),
                        ),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      constraints: const BoxConstraints(
                        minWidth: 20,
                        minHeight: 20,
                      ),
                      child: Text(
                        '$unreadCount',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                )
                    : const SizedBox.shrink(); // No badge if no unread notifications
              },
              loading: () => const SizedBox.shrink(), // No badge during loading
              error: (error, stack) => const SizedBox.shrink(),
            ),
          ],
        ),
        PopupMenuButton<String>(
          icon: const Icon(Icons.more_vert, color: Colors.white),
          onSelected: (String result) {
            if (result == 'Logout') {
              _logout(context, ref);
            }
          },
          itemBuilder: (BuildContext context) {
            List<PopupMenuEntry<String>> menuItems = [

            ];
            if (user != null) {
              menuItems.add(
                const PopupMenuItem<String>(
                  value: 'Logout',
                  child: Text('Logout'),
                ),
              );
            }

            return menuItems;
          },
        ),
      ],
    );
  }

  void _logout(BuildContext context, WidgetRef ref) async {
    await ref
        .read(userPresenceNotifierProvider.notifier)
        .setPresence(false); // Set user presence to offline
    await FirebaseAuth.instance.signOut();

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => const AuthPage(loginMode: true)),
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(
      kToolbarHeight + (tabController != null ? kTextTabBarHeight : 0.0));
}
