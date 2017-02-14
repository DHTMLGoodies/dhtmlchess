<?php

/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 25/01/2017
 * Time: 12:45
 */
class DhtmlChessInstaller
{

    private static $testMode = false;
    public function __construct(){
        
    }

    public static function enableTestMode(){
        self::$testMode = true;
    }

    public static function disableTestMode(){
        self::$testMode = false;
    }

    public function install(){
        /**
         * @var wpdb $wpdb
         */
        global $wpdb;


        $charset_collate = "";


        $useDbDelta = false;
        if(file_exists(ABSPATH . 'wp-admin/includes/upgrade.php')){
            $charset_collate = $wpdb->get_charset_collate().";";
            require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
            $useDbDelta = true;
        }

        $queries = array(

            "create table ". DhtmlChessDatabase::TABLE_PGN . "("
            . DhtmlChessDatabase::COL_ID . " int auto_increment not null primary key,"
            . DhtmlChessDatabase::COL_PGN_NAME . " varchar(255),"
            . DhtmlChessDatabase::COL_TMP . " varchar(255),"
            . DhtmlChessDatabase::COL_ARCHIVED . " char(1) default '0', "
            . DhtmlChessDatabase::COL_HIDDEN . " char(1) default '0' ,"
            . DhtmlChessDatabase::COL_UPDATED . " timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)$charset_collate",

            "create table " . DhtmlChessDatabase::TABLE_GAME . "("
            . DhtmlChessDatabase::COL_ID . " int auto_increment not null primary key,"
            . DhtmlChessDatabase::COL_PGN_ID . " int,"
            . DhtmlChessDatabase::COL_SORT . " int,"
            . DhtmlChessDatabase::COL_DHTML_CHESS_ID . " int,"
            . DhtmlChessDatabase::COL_GAME . " mediumtext, "
            . DhtmlChessDatabase::COL_UPDATED . " timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)$charset_collate"

            , "create table " . DhtmlChessDatabase::TABLE_CACHE . "("
            . DhtmlChessDatabase::COL_ID . " int auto_increment not null primary key,"
            . DhtmlChessDatabase::COL_CACHE_KEY . " varchar(255),"
            . DhtmlChessDatabase::COL_UPDATED . " timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"
            . DhtmlChessDatabase::COL_CACHE_VALUE . " mediumtext)$charset_collate;"

            , "create table " . DhtmlChessDatabase::TABLE_DRAFT . "("
            . DhtmlChessDatabase::COL_ID . " int auto_increment not null primary key,"
            . DhtmlChessDatabase::COL_TITLE . " varchar(1024), "
            . DhtmlChessDatabase::COL_GAME . " mediumtext, "
            . DhtmlChessDatabase::COL_UPDATED . " timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)$charset_collate;",

            "create index wp_index_dhtml_chess_pgn_arc on " . DhtmlChessDatabase::TABLE_PGN . "(" . DhtmlChessDatabase::COL_ARCHIVED . ")",
            "create index wp_index_dhtml_chess_game_did on " . DhtmlChessDatabase::TABLE_GAME . "(" . DhtmlChessDatabase::COL_DHTML_CHESS_ID . ")",
            "create index wp_index_dhtml_chess_game_pgn on " . DhtmlChessDatabase::TABLE_GAME . "(" . DhtmlChessDatabase::COL_PGN_ID . ")",
            "create index wp_index_dhtml_chess_cache_key on " . DhtmlChessDatabase::TABLE_CACHE . "(" . DhtmlChessDatabase::COL_CACHE_KEY . ")"
        );



        try{
            foreach($queries as $query){
                if($useDbDelta){
                    dbDelta($query);
                }else{
                    $wpdb->query($query);
                }
            }

        }catch(DhtmlChessException $e){
            throw new Exception("Unable to create database, try to do it manually with " . join(";\n", $queries));
        }
        
        if(!self::$testMode){
            $this->importDefaultPgn();
        }

        /*

        $wpdb->query('create table ' . DhtmlChessDatabase::TABLE_GAME . '('
            . DhtmlChessDatabase::COL_ID . ' int auto_increment not null primary key,'
            . DhtmlChessDatabase::COL_PGN_ID . ' int,'
            . DhtmlChessDatabase::COL_SORT . ' int,'
            . DhtmlChessDatabase::COL_DHTML_CHESS_ID . ' int,'
            . DhtmlChessDatabase::COL_GAME . ' mediumtext, '
            . DhtmlChessDatabase::COL_UPDATED . ' timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)');

        $wpdb->query('create table ' . DhtmlChessDatabase::TABLE_CACHE . '('
            . DhtmlChessDatabase::COL_ID . ' int auto_increment not null primary key,'
            . DhtmlChessDatabase::COL_CACHE_KEY . ' varchar(255),'
            . DhtmlChessDatabase::COL_UPDATED . ' timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,'
            . DhtmlChessDatabase::COL_CACHE_VALUE . ' mediumtext)');


        $wpdb->query('create table ' . DhtmlChessDatabase::TABLE_DRAFT . '('
            . DhtmlChessDatabase::COL_ID . ' int auto_increment not null primary key,'
            . DhtmlChessDatabase::COL_TITLE . ' varchar(1024), '
            . DhtmlChessDatabase::COL_GAME . ' mediumtext, '
            . DhtmlChessDatabase::COL_UPDATED . ' timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)');

        $wpdb->query('create index wp_index_dhtml_chess_pgn_arc on ' . DhtmlChessDatabase::TABLE_PGN . '(' . DhtmlChessDatabase::COL_ARCHIVED . ')');
        $wpdb->query('create index wp_index_dhtml_chess_game_did on ' . DhtmlChessDatabase::TABLE_GAME . '(' . DhtmlChessDatabase::COL_DHTML_CHESS_ID . ')');
        $wpdb->query('create index wp_index_dhtml_chess_game_pgn on ' . DhtmlChessDatabase::TABLE_GAME . '(' . DhtmlChessDatabase::COL_PGN_ID . ')');
        $wpdb->query('create index wp_index_dhtml_chess_cache_key on ' . DhtmlChessDatabase::TABLE_CACHE . '(' . DhtmlChessDatabase::COL_CACHE_KEY . ')');
        */



    }
    
    private function importDefaultPgn(){
        $import = new DhtmlChessImportPgn();
        $import->createFromPgnString("Great Games", $this->pgn);
        $pgn = $import->createFromPgnString("tactic-template", $this->pgnTactic);
        $pgn->setHidden();
        $pgn = $import->createFromPgnString("viewer-template", $this->pgnViewer);
        $pgn->setHidden();

        $pgn = $import->createFromPgnString("tournament-template", $this->tournamentPgn);
        $pgn->setHidden();
        
    }
    
    public function upgrade($oldVersion, $newVersion){
        global $wpdb;
        
        
    }
    
    public function uninstall(){
        global $wpdb;
        
       # $wpdb->query('drop table if exists ' . DhtmlChessDatabase::TABLE_GAME);
       # $wpdb->query('drop table if exists ' . DhtmlChessDatabase::TABLE_PGN);
       # $wpdb->query('drop table if exists ' . DhtmlChessDatabase::TABLE_CACHE);
       # $wpdb->query('drop table if exists ' . DhtmlChessDatabase::TABLE_DRAFT);
    }

    private $pgnTactic = '[setup "1"]
[castle "1"]
[event " White to move."]
[site "?"]
[date "1998.??.??"]
[round "?"]
[white "White mates in 5"]
[black "1001 Brilliant Ways to Checkmate"]
[result "1-0"]
[fen "6rk/R6p/2pp4/1pP2n2/1P2B1Q1/n6P/7K/r3q3 w - - 0 1"]
[plycount "9"]
[index "4"]
[ts "1485818748064"]


1. Rxh7+  Kxh7 2. Qxf5+  Kg7 3. Qg6+  Kf8 4. Qf6+  Ke8 5. Bxc6#

';

    private $pgnViewer = '[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.18"]
[Round "9.1"]
[White "So, Wesley"]
[Black "Vachier-Lagrave, Maxime"]
[Result "1/2-1/2"]
[BlackElo "2804"]
[WhiteElo "2794"]
[LiveChessVersion "1.4.8"]
[ECO "A04"]

1. Nf3 {[%clk 1:59:56]} c5 {[%clk 1:59:51]} 2. c4 {[%clk 1:59:51]} Nc6
{[%clk 1:59:48]} 3. Nc3 {[%clk 1:59:45]} e5 {[%clk 1:59:45]} 4. e3
{[%clk 1:59:33]} Nf6 {[%clk 1:59:40]} 5. Be2 {[%clk 1:59:26]} d5 {[%clk 1:59:14]}
6. d4 {[%clk 1:59:18]} cxd4 {[%clk 1:58:32]} 7. exd4 {[%clk 1:59:11]} e4
{[%clk 1:58:29]} 8. Ne5 {[%clk 1:59:04]} dxc4 {[%clk 1:58:26]} 9. Bxc4
{[%clk 1:58:42]} Nxe5 {[%clk 1:58:21]} 10. dxe5 {[%clk 1:58:38]} Qxd1+
{[%clk 1:58:18]} 11. Kxd1 {[%clk 1:58:31]} Ng4 {[%clk 1:58:15]} 12. e6
{[%clk 1:58:24]} fxe6 {[%clk 1:58:11]} 13. Nxe4 {[%clk 1:57:17]} Bd7
{[%clk 1:57:19]} 14. f3 {[%clk 1:56:56]} Ne5 {[%clk 1:53:13]} 15. Bb3
{[%clk 1:56:50]} Rd8 {[%clk 1:42:01]} 16. Bd2 {[%clk 1:56:12]} Nd3
{[%clk 1:41:54]} 17. Kc2 {[%clk 1:49:59]} Nb4+ {[%clk 1:41:47]} 18. Bxb4
{[%clk 1:49:55]} Bxb4 {[%clk 1:41:40]} 19. Nc3 {[%clk 1:49:48]} Ke7
{[%clk 1:36:22]} 20. Rhe1 {[%clk 1:48:59]} Bxc3 {[%clk 1:36:16]} 21. Kxc3
{[%clk 1:46:18]} Rc8+ {[%clk 1:33:40]} 22. Kd2 {[%clk 1:46:11]} Rhd8
{[%clk 1:33:36]} 23. Ke3 {[%clk 1:46:06]} e5 {[%clk 1:29:17]} 24. Rad1
{[%clk 1:43:07]} Bc6 {[%clk 1:28:23]} 25. h4 {[%clk 1:41:49]} h6 {[%clk 1:27:41]}
26. a3 {[%clk 1:40:10]} Rxd1 {[%clk 1:22:21]} 27. Rxd1 {[%clk 1:40:05]} Rf8
{[%clk 1:21:39]} 28. Rf1 {[%clk 1:37:25]} Rf4 {[%clk 1:20:34]} 29. g3
{[%clk 1:37:12]} Rd4 {[%clk 1:20:28]} 30. Rd1 {[%clk 1:36:36]} Rxd1
{[%clk 1:20:24]} 31. Bxd1 {[%clk 1:36:34]} g5 {[%clk 1:19:44]} 32. hxg5
{[%clk 1:36:30]} hxg5 {[%clk 1:19:39]} 33. f4 {[%clk 1:36:26]} gxf4+
{[%clk 1:19:36]} 34. gxf4 {[%clk 1:36:23]} exf4+ {[%clk 1:19:34]} 35. Kxf4
{[%clk 1:36:19]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.18"]
[Round "9.2"]
[White "Anand, Viswanathan"]
[Black "Kramnik, Vladimir"]
[Result "1/2-1/2"]
[BlackElo "2809"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:54]} Nf6 {[%clk 1:59:47]} 2. c4 {[%clk 1:59:38]} e6
{[%clk 1:59:39]} 3. Nf3 {[%clk 1:59:30]} d5 {[%clk 1:59:32]} 4. Nc3
{[%clk 1:59:19]} Be7 {[%clk 1:55:54]} 5. Bf4 {[%clk 1:58:45]} O-O
{[%clk 1:55:47]} 6. e3 {[%clk 1:58:37]} b6 {[%clk 1:54:41]} 7. Bd3
{[%clk 1:52:51]} c5 {[%clk 1:52:16]} 8. dxc5 {[%clk 1:45:54]} bxc5
{[%clk 1:49:56]} 9. O-O {[%clk 1:41:57]} Nc6 {[%clk 1:48:05]} 10. cxd5
{[%clk 1:33:59]} exd5 {[%clk 1:44:46]} 11. Rc1 {[%clk 1:32:48]} h6
{[%clk 1:35:23]} 12. h3 {[%clk 1:19:49]} Be6 {[%clk 1:34:23]} 13. Bb5
{[%clk 1:15:50]} Qb6 {[%clk 1:27:38]} 14. Qa4 {[%clk 1:14:36]} Rfc8
{[%clk 1:17:52]} 15. Ne5 {[%clk 1:08:50]} Nxe5 {[%clk 1:11:44]} 16. Bxe5
{[%clk 1:07:46]} a6 {[%clk 1:11:21]} 17. Be2 {[%clk 1:07:15]} Rd8
{[%clk 1:06:46]} 18. Bf3 {[%clk 1:04:59]} Nd7 {[%clk 0:54:31]} 19. Bg3
{[%clk 1:00:41]} Nf6 {[%clk 0:52:41]} 20. Rfd1 {[%clk 0:55:58]} Rac8
{[%clk 0:45:31]} 21. Be5 {[%clk 0:52:11]} Nd7 {[%clk 0:44:41]} 22. Bg3
{[%clk 0:50:53]} Nf6 {[%clk 0:44:30]} 23. Be5 {[%clk 0:50:34]} Nd7
{[%clk 0:43:53]} 24. Bg3 {[%clk 0:50:25]} Nf6 {[%clk 0:43:48]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.18"]
[Round "9.3"]
[White "Giri, Anish"]
[Black "Caruana, Fabiano"]
[Result "1/2-1/2"]
[BlackElo "2823"]
[WhiteElo "2771"]
[LiveChessVersion "1.4.8"]
[ECO "D27"]

1. d4 {[%clk 1:59:59]} d5 {[%clk 1:59:55]} 2. Nf3 {[%clk 1:59:21]} Nf6
{[%clk 1:59:49]} 3. c4 {[%clk 1:59:11]} dxc4 {[%clk 1:59:43]} 4. e3
{[%clk 1:59:00]} e6 {[%clk 1:59:37]} 5. Bxc4 {[%clk 1:58:55]} c5 {[%clk 1:59:29]}
6. O-O {[%clk 1:57:43]} a6 {[%clk 1:59:24]} 7. b3 {[%clk 1:57:02]} cxd4
{[%clk 1:55:14]} 8. Nxd4 {[%clk 1:56:12]} Bd7 {[%clk 1:55:07]} 9. Bb2
{[%clk 1:54:42]} Nc6 {[%clk 1:54:35]} 10. Nf3 {[%clk 1:53:57]} Be7
{[%clk 1:35:37]} 11. Nbd2 {[%clk 1:49:59]} O-O {[%clk 1:35:28]} 12. Rc1
{[%clk 1:47:43]} Rc8 {[%clk 1:26:50]} 13. Qe2 {[%clk 1:46:40]} Nb4
{[%clk 1:21:13]} 14. a3 {[%clk 1:44:38]} b5 {[%clk 1:20:22]} 15. axb4
{[%clk 1:33:35]} bxc4 {[%clk 1:20:14]} 16. Nxc4 {[%clk 1:25:34]} Bxb4
{[%clk 1:14:31]} 17. Ra1 {[%clk 1:05:41]} Bb5 {[%clk 1:11:27]} 18. Nd4
{[%clk 1:05:30]} Bxc4 {[%clk 1:08:54]} 19. bxc4 {[%clk 1:05:26]} a5
{[%clk 1:08:06]} 20. Rfc1 {[%clk 1:03:26]} Nd7 {[%clk 1:04:46]} 21. Nb3
{[%clk 1:02:40]} Qg5 {[%clk 0:57:38]} 22. c5 {[%clk 0:59:07]} Nxc5
{[%clk 0:50:16]} 23. Nxa5 {[%clk 0:58:58]} Ne4 {[%clk 0:46:51]} 24. Nc6
{[%clk 0:55:53]} Bc5 {[%clk 0:44:28]} 25. Nd4 {[%clk 0:53:04]} Bxd4
{[%clk 0:44:02]} 26. Bxd4 {[%clk 0:52:55]} Rxc1+ {[%clk 0:43:51]} 27. Rxc1
{[%clk 0:52:53]} e5 {[%clk 0:43:35]} 28. Bb2 {[%clk 0:52:28]} Rd8
{[%clk 0:31:59]} 29. Rd1 {[%clk 0:38:31]} Rxd1+ {[%clk 0:29:21]} 30. Qxd1
{[%clk 0:38:25]} h5 {[%clk 0:28:45]} 31. Qd3 {[%clk 0:28:32]} Nf6
{[%clk 0:27:20]} 32. h3 {[%clk 0:23:04]} e4 {[%clk 0:27:05]} 33. Qd8+
{[%clk 0:20:10]} Kh7 {[%clk 0:27:00]} 34. Qe7 {[%clk 0:19:53]} Qg6
{[%clk 0:26:47]} 35. Bxf6 {[%clk 0:18:33]} gxf6 {[%clk 0:26:43]} 36. Qc5
{[%clk 0:17:27]} Kg7 {[%clk 0:26:09]} 37. Qd5 {[%clk 0:17:16]} f5
{[%clk 0:23:58]} 38. Qe5+ {[%clk 0:17:06]} Qf6 {[%clk 0:15:13]} 39. Qg3+
{[%clk 0:12:55]} Kh7 {[%clk 0:14:30]} 40. Kh2 {[%clk 1:12:36]} Qe7
{[%clk 1:13:18]} 41. Qf4 {[%clk 1:12:48]} Kg6 {[%clk 1:12:15]} 42. Kg3
{[%clk 1:12:09]} Qd8 {[%clk 1:11:53]} 43. Qe5 {[%clk 1:11:27]} Qg5+
{[%clk 1:11:33]} 44. Kh2 {[%clk 1:11:53]} Qd8 {[%clk 1:11:59]} 45. Qg3+
{[%clk 1:11:54]} Kh7 {[%clk 1:11:57]} 46. Qf4 {[%clk 1:10:44]} Kg6
{[%clk 1:12:17]} 47. Qe5 {[%clk 1:11:11]} Qd2 {[%clk 1:10:57]} 48. Qg3+
{[%clk 1:04:09]} Kh6 {[%clk 1:11:13]} 49. Qf4+ {[%clk 1:04:38]} Kg6
{[%clk 1:11:38]} 50. Qg3+ {[%clk 1:05:07]} Kh6 {[%clk 1:12:03]} 51. Qh4
{[%clk 1:05:34]} Qd6+ {[%clk 1:06:31]} 52. Qf4+ {[%clk 1:03:05]} Qxf4+
{[%clk 1:06:55]} 53. exf4 {[%clk 1:03:32]} Kg6 {[%clk 1:07:17]} 54. Kg1
{[%clk 1:01:38]} Kg7 {[%clk 1:06:57]} 55. Kf1 {[%clk 1:01:42]} Kf6
{[%clk 1:07:21]} 56. Ke2 {[%clk 1:00:23]} Ke6 {[%clk 1:07:46]} 57. Kd2
{[%clk 1:00:41]} Kd6 {[%clk 1:08:05]} 58. Ke2 {[%clk 1:00:29]} Ke6
{[%clk 1:08:30]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.18"]
[Round "9.4"]
[White "Adams, Michael"]
[Black "Nakamura, Hikaru"]
[Result "1/2-1/2"]
[BlackElo "2779"]
[WhiteElo "2748"]
[LiveChessVersion "1.4.8"]
[ECO "C67"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:52]} 2. Nf3 {[%clk 1:59:51]} Nc6
{[%clk 1:59:40]} 3. Bb5 {[%clk 1:59:44]} Nf6 {[%clk 1:59:33]} 4. O-O
{[%clk 1:59:38]} Nxe4 {[%clk 1:59:28]} 5. Re1 {[%clk 1:59:34]} Nd6
{[%clk 1:59:20]} 6. Nxe5 {[%clk 1:59:29]} Be7 {[%clk 1:59:01]} 7. Bf1
{[%clk 1:59:23]} Nf5 {[%clk 1:58:57]} 8. Nf3 {[%clk 1:59:14]} O-O
{[%clk 1:58:43]} 9. d4 {[%clk 1:59:01]} d5 {[%clk 1:58:38]} 10. c3
{[%clk 1:58:39]} Re8 {[%clk 1:58:32]} 11. Bd3 {[%clk 1:55:12]} Bd6
{[%clk 1:55:29]} 12. Rxe8+ {[%clk 1:54:25]} Qxe8 {[%clk 1:55:21]} 13. Qc2
{[%clk 1:51:14]} g6 {[%clk 1:55:12]} 14. Nbd2 {[%clk 1:50:37]} Bd7
{[%clk 1:54:00]} 15. Nf1 {[%clk 1:49:23]} b6 {[%clk 1:51:14]} 16. Ng3
{[%clk 1:27:22]} Nxg3 {[%clk 1:48:00]} 17. hxg3 {[%clk 1:26:11]} f6
{[%clk 1:45:21]} 18. Bf4 {[%clk 1:23:33]} Bxf4 {[%clk 1:27:39]} 19. gxf4
{[%clk 1:23:25]} Qf7 {[%clk 1:27:36]} 20. Nh4 {[%clk 1:03:59]} Kg7
{[%clk 1:20:23]} 21. g3 {[%clk 1:03:26]} Ne7 {[%clk 1:12:03]} 22. Re1
{[%clk 0:48:31]} Re8 {[%clk 1:10:48]} 23. Re3 {[%clk 0:48:08]} Nc8
{[%clk 1:01:22]} 24. Ng2 {[%clk 0:47:43]} Nd6 {[%clk 0:59:06]} 25. Rxe8
{[%clk 0:47:27]} Qxe8 {[%clk 0:57:38]} 26. Ne3 {[%clk 0:47:18]} Be6
{[%clk 0:57:30]} 27. f5 {[%clk 0:40:37]} Bf7 {[%clk 0:56:37]} 28. fxg6
{[%clk 0:40:31]} hxg6 {[%clk 0:56:33]} 29. Qe2 {[%clk 0:40:11]} Be6
{[%clk 0:48:41]} 30. Ng2 {[%clk 0:37:05]} c6 {[%clk 0:44:13]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.18"]
[Round "9.5"]
[White "Aronian, Levon"]
[Black "Topalov, Veselin"]
[Result "0-1"]
[BlackElo "2760"]
[WhiteElo "2785"]
[LiveChessVersion "1.4.8"]
[ECO "A37"]

1. c4 {[%clk 1:59:56]} g6 {[%clk 1:59:05]} 2. Nc3 {[%clk 1:59:23]} c5
{[%clk 1:58:50]} 3. g3 {[%clk 1:59:18]} Bg7 {[%clk 1:58:40]} 4. Bg2
{[%clk 1:59:14]} Nc6 {[%clk 1:58:21]} 5. Nf3 {[%clk 1:59:08]} d6 {[%clk 1:57:43]}
6. O-O {[%clk 1:59:02]} e6 {[%clk 1:57:36]} 7. e3 {[%clk 1:58:58]} Nge7
{[%clk 1:57:14]} 8. d4 {[%clk 1:58:53]} O-O {[%clk 1:56:56]} 9. Re1
{[%clk 1:58:50]} a6 {[%clk 1:54:57]} 10. Bd2 {[%clk 1:53:00]} Rb8
{[%clk 1:43:56]} 11. Rc1 {[%clk 1:47:43]} b6 {[%clk 1:30:26]} 12. Ne2
{[%clk 1:46:34]} e5 {[%clk 1:24:40]} 13. Bc3 {[%clk 1:45:37]} h6 {[%clk 1:21:14]}
14. d5 {[%clk 1:34:07]} Nb4 {[%clk 1:20:01]} 15. Ra1 {[%clk 1:32:30]} b5
{[%clk 1:05:38]} 16. a3 {[%clk 1:28:27]} bxc4 {[%clk 1:05:22]} 17. axb4
{[%clk 1:28:22]} cxb4 {[%clk 1:05:11]} 18. Bd2 {[%clk 1:28:17]} Nxd5
{[%clk 1:02:30]} 19. Qc1 {[%clk 1:28:03]} c3 {[%clk 0:55:18]} 20. bxc3
{[%clk 1:27:44]} b3 {[%clk 0:55:12]} 21. Qb1 {[%clk 1:13:08]} Nf6
{[%clk 0:44:06]} 22. Qb2 {[%clk 1:13:03]} Qc7 {[%clk 0:40:11]} 23. c4
{[%clk 1:05:11]} Qxc4 {[%clk 0:39:43]} 24. Nc3 {[%clk 1:05:00]} Be6
{[%clk 0:35:10]} 25. Rec1 {[%clk 1:03:29]} Nd7 {[%clk 0:27:05]} 26. e4
{[%clk 0:59:13]} Nc5 {[%clk 0:23:25]} 27. Bf1 {[%clk 0:53:30]} Qb4
{[%clk 0:18:55]} 28. Be3 {[%clk 0:45:51]} Rfc8 {[%clk 0:16:41]} 29. Nd2
{[%clk 0:45:02]} a5 {[%clk 0:14:40]} 30. Bxc5 {[%clk 0:43:37]} Rxc5
{[%clk 0:13:39]} 31. Ra4 {[%clk 0:43:30]} Qb7 {[%clk 0:11:59]} 32. Bc4
{[%clk 0:42:38]} Qc6 {[%clk 0:09:43]} 33. Bd5 {[%clk 0:35:57]} Bxd5
{[%clk 0:09:15]} 34. exd5 {[%clk 0:35:52]} Qd7 {[%clk 0:08:50]} 35. Ra3
{[%clk 0:34:32]} a4 {[%clk 0:05:45]} 36. Nxa4 {[%clk 0:34:21]} Rxd5
{[%clk 0:04:08]} 37. Nxb3 {[%clk 0:31:22]} e4 {[%clk 0:03:43]} 38. Qa2
{[%clk 0:28:38]} Qf5 {[%clk 0:02:43]} 39. Re1 {[%clk 0:21:47]} Rdb5
{[%clk 0:01:55]} 40. Rc1 {[%clk 1:08:42]} d5 {[%clk 1:00:55]} 41. Nac5
{[%clk 1:07:03]} d4 {[%clk 0:56:36]} 42. Ra7 {[%clk 1:03:07]} d3 {[%clk 0:53:19]}
43. Rc7 {[%clk 0:51:58]} h5 {[%clk 0:45:29]} 44. Qa4 {[%clk 0:37:28]} h4
{[%clk 0:34:38]} 45. Qxe4 {[%clk 0:23:24]} Qxe4 {[%clk 0:34:48]} 46. Nxe4
{[%clk 0:23:51]} Rxb3 {[%clk 0:35:09]} 47. gxh4 {[%clk 0:23:06]} Bh6
{[%clk 0:33:27]} 48. Rf1 {[%clk 0:19:41]} R3b4 {[%clk 0:29:26]} 49. f3
{[%clk 0:17:22]} Rb2 {[%clk 0:24:57]} 50. Nf6+ {[%clk 0:06:19]} Kg7
{[%clk 0:23:55]} 51. Ng4 {[%clk 0:06:44]} d2 {[%clk 0:20:53]} 52. Rd7
{[%clk 0:02:06]} Re8 {[%clk 0:21:00]} 53. Nf2 {[%clk 0:00:40]} Re1
{[%clk 0:20:35]} 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.17"]
[Round "8.1"]
[White "Caruana, Fabiano"]
[Black "So, Wesley"]
[Result "1/2-1/2"]
[BlackElo "2794"]
[WhiteElo "2823"]
[LiveChessVersion "1.4.8"]
[ECO "C65"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:53]} 2. Nf3 {[%clk 1:59:53]} Nc6
{[%clk 1:59:49]} 3. Bb5 {[%clk 1:59:49]} Nf6 {[%clk 1:59:46]} 4. d3
{[%clk 1:59:44]} Bc5 {[%clk 1:59:43]} 5. c3 {[%clk 1:59:19]} O-O {[%clk 1:59:37]}
6. O-O {[%clk 1:58:58]} d5 {[%clk 1:59:33]} 7. exd5 {[%clk 1:58:00]} Qxd5
{[%clk 1:59:28]} 8. Bc4 {[%clk 1:57:54]} Qd8 {[%clk 1:59:24]} 9. Nbd2
{[%clk 1:57:07]} a5 {[%clk 1:59:12]} 10. a4 {[%clk 1:56:06]} h6 {[%clk 1:54:35]}
11. Re1 {[%clk 1:53:59]} Bf5 {[%clk 1:39:37]} 12. Nf1 {[%clk 1:47:38]} e4
{[%clk 1:34:12]} 13. Ng3 {[%clk 1:40:15]} Bh7 {[%clk 1:34:03]} 14. dxe4
{[%clk 1:31:48]} Qxd1 {[%clk 1:30:53]} 15. Rxd1 {[%clk 1:31:42]} Bxe4
{[%clk 1:30:22]} 16. Bf4 {[%clk 1:30:15]} Bb6 {[%clk 1:27:11]} 17. Nxe4
{[%clk 1:11:39]} Nxe4 {[%clk 1:27:05]} 18. Bg3 {[%clk 1:11:36]} Rae8
{[%clk 1:15:33]} 19. Rd7 {[%clk 0:53:53]} Nxg3 {[%clk 0:50:37]} 20. hxg3
{[%clk 0:51:26]} Ne5 {[%clk 0:50:34]} 21. Nxe5 {[%clk 0:51:20]} Rxe5
{[%clk 0:50:32]} 22. Rad1 {[%clk 0:48:28]} Rf5 {[%clk 0:49:54]} 23. R1d2
{[%clk 0:48:01]} Re8 {[%clk 0:49:49]} 24. Kf1 {[%clk 0:28:02]} Kf8
{[%clk 0:49:45]} 25. f3 {[%clk 0:25:21]} Re7 {[%clk 0:48:32]} 26. Rd8+
{[%clk 0:25:09]} Re8 {[%clk 0:48:27]} 27. R8d7 {[%clk 0:25:00]} Re7
{[%clk 0:48:19]} 28. Rd8+ {[%clk 0:24:45]} Re8 {[%clk 0:48:14]} 29. R2d7
{[%clk 0:24:12]} Rxd8 {[%clk 0:43:57]} 30. Rxd8+ {[%clk 0:24:06]} Ke7
{[%clk 0:43:54]} 31. Rg8 {[%clk 0:23:17]} Rg5 {[%clk 0:43:47]} 32. g4
{[%clk 0:23:08]} Bc5 {[%clk 0:43:32]} 33. Bd3 {[%clk 0:13:41]} Bd6
{[%clk 0:41:17]} 34. Kf2 {[%clk 0:12:19]} Kf6 {[%clk 0:40:42]} 35. Re8
{[%clk 0:10:11]} Rd5 {[%clk 0:40:32]} 36. Ke2 {[%clk 0:09:55]} Re5+
{[%clk 0:40:28]} 37. Rxe5 {[%clk 0:09:51]} Kxe5 {[%clk 0:40:24]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.17"]
[Round "8.2"]
[White "Nakamura, Hikaru"]
[Black "Aronian, Levon"]
[Result "1/2-1/2"]
[BlackElo "2785"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "D38"]

1. d4 {[%clk 1:59:55]} Nf6 {[%clk 1:59:54]} 2. c4 {[%clk 1:59:50]} e6
{[%clk 1:59:49]} 3. Nf3 {[%clk 1:59:40]} d5 {[%clk 1:59:44]} 4. Nc3
{[%clk 1:59:13]} Bb4 {[%clk 1:59:37]} 5. Qb3 {[%clk 1:58:56]} c5 {[%clk 1:59:26]}
6. dxc5 {[%clk 1:58:21]} Nc6 {[%clk 1:59:14]} 7. Bg5 {[%clk 1:57:53]} dxc4
{[%clk 1:58:57]} 8. Qxc4 {[%clk 1:57:27]} Qa5 {[%clk 1:58:47]} 9. Rc1
{[%clk 1:57:01]} Qxc5 {[%clk 1:56:24]} 10. Qxc5 {[%clk 1:52:03]} Bxc5
{[%clk 1:56:16]} 11. e3 {[%clk 1:51:51]} Bb4 {[%clk 1:51:37]} 12. a3
{[%clk 1:42:06]} Bxc3+ {[%clk 1:51:31]} 13. Rxc3 {[%clk 1:42:02]} Ne4
{[%clk 1:51:24]} 14. Rc1 {[%clk 1:41:26]} Nxg5 {[%clk 1:44:49]} 15. Nxg5
{[%clk 1:41:19]} Ke7 {[%clk 1:44:41]} 16. Ne4 {[%clk 1:08:05]} Bd7
{[%clk 1:39:04]} 17. Nc5 {[%clk 1:05:55]} Rhc8 {[%clk 1:38:58]} 18. Nxd7
{[%clk 1:02:08]} Kxd7 {[%clk 1:38:53]} 19. Bb5 {[%clk 1:02:05]} a6
{[%clk 1:38:47]} 20. Bxc6+ {[%clk 1:01:52]} Rxc6 {[%clk 1:38:41]} 21. Rxc6
{[%clk 1:01:37]} Kxc6 {[%clk 1:38:37]} 22. Ke2 {[%clk 1:01:29]} Rd8
{[%clk 1:35:10]} 23. Rc1+ {[%clk 1:00:45]} Kd7 {[%clk 1:35:03]} 24. Rd1+
{[%clk 1:00:17]} Ke7 {[%clk 1:34:54]} 25. Rc1 {[%clk 0:59:46]} Kd7
{[%clk 1:34:48]} 26. Rd1+ {[%clk 0:58:28]} Ke7 {[%clk 1:34:43]} 27. Rc1
{[%clk 0:55:06]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.17"]
[Round "8.3"]
[White "Kramnik, Vladimir"]
[Black "Giri, Anish"]
[Result "1/2-1/2"]
[BlackElo "2771"]
[WhiteElo "2809"]
[LiveChessVersion "1.4.8"]
[ECO "B91"]

1. e4 {[%clk 1:59:57]} c5 {[%clk 1:59:57]} 2. Nf3 {[%clk 1:59:52]} d6
{[%clk 1:59:50]} 3. d4 {[%clk 1:59:47]} cxd4 {[%clk 1:59:46]} 4. Nxd4
{[%clk 1:59:43]} Nf6 {[%clk 1:59:42]} 5. Nc3 {[%clk 1:59:32]} a6 {[%clk 1:59:38]}
6. g3 {[%clk 1:59:23]} e5 {[%clk 1:59:34]} 7. Nde2 {[%clk 1:59:17]} Be6
{[%clk 1:59:32]} 8. Bg2 {[%clk 1:58:34]} h5 {[%clk 1:59:29]} 9. Bg5
{[%clk 1:52:28]} Nbd7 {[%clk 1:59:17]} 10. Qd2 {[%clk 1:48:07]} Be7
{[%clk 1:57:19]} 11. a4 {[%clk 1:41:01]} Rc8 {[%clk 1:57:04]} 12. O-O
{[%clk 1:39:26]} Nf8 {[%clk 1:55:21]} 13. Bxf6 {[%clk 1:30:21]} Bxf6
{[%clk 1:53:28]} 14. Rfd1 {[%clk 1:29:13]} Be7 {[%clk 1:36:50]} 15. Nd5
{[%clk 1:26:34]} h4 {[%clk 1:35:57]} 16. Nec3 {[%clk 1:14:49]} Nh7
{[%clk 1:31:47]} 17. Ra3 {[%clk 1:02:06]} Rc6 {[%clk 1:21:30]} 18. Rb3
{[%clk 0:58:55]} Qb8 {[%clk 1:14:45]} 19. Na2 {[%clk 0:51:31]} Bxd5
{[%clk 1:00:15]} 20. Qxd5 {[%clk 0:50:52]} Qc8 {[%clk 0:59:48]} 21. Nb4
{[%clk 0:42:24]} Nf6 {[%clk 0:59:12]} 22. Qd2 {[%clk 0:36:49]} Rc5
{[%clk 0:57:52]} 23. Rc1 {[%clk 0:34:51]} hxg3 {[%clk 0:54:33]} 24. hxg3
{[%clk 0:33:59]} g6 {[%clk 0:53:53]} 25. Rd3 {[%clk 0:32:38]} Kf8
{[%clk 0:49:06]} 26. c3 {[%clk 0:31:02]} Kg7 {[%clk 0:48:39]} 27. Rd1
{[%clk 0:28:29]} Qd7 {[%clk 0:42:43]} 28. b3 {[%clk 0:27:05]} Qg4
{[%clk 0:40:14]} 29. c4 {[%clk 0:23:11]} Nxe4 {[%clk 0:35:41]} 30. f3
{[%clk 0:22:13]} Nxd2 {[%clk 0:35:31]} 31. fxg4 {[%clk 0:22:08]} Nxc4
{[%clk 0:35:27]} 32. bxc4 {[%clk 0:21:17]} Rxc4 {[%clk 0:35:20]} 33. Nd5
{[%clk 0:19:04]} Bd8 {[%clk 0:33:19]} 34. Ra1 {[%clk 0:17:17]} Rxg4
{[%clk 0:32:02]} 35. a5 {[%clk 0:16:36]} e4 {[%clk 0:27:13]} 36. Rb3
{[%clk 0:09:58]} Rh5 {[%clk 0:25:20]} 37. Ne3 {[%clk 0:03:08]} Rgg5
{[%clk 0:23:29]} 38. Kf2 {[%clk 0:01:47]} Rxa5 {[%clk 0:10:49]} 39. Rxa5
{[%clk 0:01:44]} Rxa5 {[%clk 0:07:48]} 40. Bxe4 {[%clk 1:01:56]} b5
{[%clk 1:08:02]} 41. Rd3 {[%clk 0:54:05]} Be7 {[%clk 1:07:46]} 42. Kf3
{[%clk 0:50:47]} Ra1 {[%clk 1:02:59]} 43. Nd5 {[%clk 0:46:45]} Bd8
{[%clk 0:43:12]} 44. Nf4 {[%clk 0:46:45]} Be7 {[%clk 0:37:32]} 45. Rc3
{[%clk 0:46:08]} d5 {[%clk 0:37:17]} 46. Bxd5 {[%clk 0:44:00]} Ra3
{[%clk 0:36:22]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.17"]
[Round "8.4"]
[White "Topalov, Veselin"]
[Black "Anand, Viswanathan"]
[Result "0-1"]
[BlackElo "2779"]
[WhiteElo "2760"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:56]} Nf6 {[%clk 1:59:51]} 2. c4 {[%clk 1:59:52]} e6
{[%clk 1:59:46]} 3. Nf3 {[%clk 1:59:43]} d5 {[%clk 1:59:39]} 4. Nc3
{[%clk 1:59:39]} Be7 {[%clk 1:59:33]} 5. Bf4 {[%clk 1:58:58]} O-O
{[%clk 1:59:24]} 6. e3 {[%clk 1:58:47]} c5 {[%clk 1:59:14]} 7. dxc5
{[%clk 1:58:38]} Bxc5 {[%clk 1:59:08]} 8. a3 {[%clk 1:57:09]} Nc6
{[%clk 1:57:43]} 9. Qc2 {[%clk 1:56:54]} Re8 {[%clk 1:57:15]} 10. O-O-O
{[%clk 1:53:11]} e5 {[%clk 1:56:36]} 11. Bg5 {[%clk 1:52:40]} d4 {[%clk 1:56:23]}
12. Nd5 {[%clk 1:51:18]} b5 {[%clk 1:56:13]} 13. Bxf6 {[%clk 1:47:05]} gxf6
{[%clk 1:56:00]} 14. cxb5 {[%clk 1:32:09]} Na5 {[%clk 1:45:50]} 15. exd4
{[%clk 1:24:25]} exd4 {[%clk 1:42:43]} 16. Nb4 {[%clk 1:16:26]} Bxb4
{[%clk 1:25:40]} 17. axb4 {[%clk 1:16:11]} Be6 {[%clk 1:25:23]} 18. Nxd4
{[%clk 1:09:05]} Rc8 {[%clk 1:25:05]} 19. Nc6 {[%clk 1:05:26]} Nxc6
{[%clk 1:24:51]} 20. bxc6 {[%clk 1:05:15]} Qb6 {[%clk 1:24:12]} 21. Qa4
{[%clk 0:58:26]} Rxc6+ {[%clk 1:11:34]} 22. Kb1 {[%clk 0:58:22]} Rd8
{[%clk 1:09:58]} 23. Rxd8+ {[%clk 0:52:36]} Qxd8 {[%clk 1:05:16]} 24. Be2
{[%clk 0:49:15]} Bf5+ {[%clk 1:01:30]} 25. Ka2 {[%clk 0:46:06]} Rc2
{[%clk 0:46:05]} 26. Rd1 {[%clk 0:44:23]} Qb6 {[%clk 0:38:08]} 27. Bg4
{[%clk 0:30:34]} Qe6+ {[%clk 0:31:12]} 28. Ka3 {[%clk 0:23:43]} Qe5
{[%clk 0:28:34]} 29. Qb3 {[%clk 0:21:04]} Bg6 {[%clk 0:26:27]} 30. Bf3
{[%clk 0:18:26]} Rxf2 {[%clk 0:25:08]} 31. h4 {[%clk 0:12:15]} Bc2
{[%clk 0:20:57]} 32. Rd8+ {[%clk 0:11:31]} Kg7 {[%clk 0:20:36]} 33. Qc3
{[%clk 0:10:17]} Qb5 {[%clk 0:20:19]} 34. Qc6 {[%clk 0:07:34]} Rxf3+
{[%clk 0:20:13]} 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.17"]
[Round "8.5"]
[White "Vachier-Lagrave, Maxime"]
[Black "Adams, Michael"]
[Result "1/2-1/2"]
[BlackElo "2748"]
[WhiteElo "2804"]
[LiveChessVersion "1.4.8"]
[ECO "C65"]

1. e4 {[%clk 1:59:58]} e5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:55]} Nc6
{[%clk 1:59:52]} 3. Bb5 {[%clk 1:59:53]} Nf6 {[%clk 1:59:45]} 4. d3
{[%clk 1:59:51]} Bc5 {[%clk 1:59:39]} 5. c3 {[%clk 1:59:47]} O-O {[%clk 1:59:24]}
6. O-O {[%clk 1:59:42]} Re8 {[%clk 1:59:12]} 7. Bg5 {[%clk 1:59:32]} h6
{[%clk 1:56:43]} 8. Bh4 {[%clk 1:58:37]} a6 {[%clk 1:55:26]} 9. Bc4
{[%clk 1:55:58]} d6 {[%clk 1:53:57]} 10. a4 {[%clk 1:50:43]} Ba7 {[%clk 1:52:47]}
11. Na3 {[%clk 1:50:00]} Be6 {[%clk 1:45:02]} 12. b4 {[%clk 1:46:20]} Nb8
{[%clk 1:35:25]} 13. Bxe6 {[%clk 1:41:18]} Rxe6 {[%clk 1:35:15]} 14. Nc4
{[%clk 1:41:08]} Nbd7 {[%clk 1:33:53]} 15. Ne3 {[%clk 1:39:40]} c6
{[%clk 1:20:56]} 16. Nd2 {[%clk 1:19:08]} a5 {[%clk 1:11:37]} 17. bxa5
{[%clk 1:12:18]} Qxa5 {[%clk 1:09:19]} 18. Ndc4 {[%clk 1:10:30]} Qa6
{[%clk 1:05:29]} 19. Nf5 {[%clk 1:08:45]} d5 {[%clk 1:02:12]} 20. Nce3
{[%clk 1:08:24]} Kh7 {[%clk 0:50:55]} 21. exd5 {[%clk 0:58:47]} Nxd5
{[%clk 0:46:43]} 22. Qh5 {[%clk 0:55:15]} Rf8 {[%clk 0:43:21]} 23. Nxd5
{[%clk 0:50:16]} cxd5 {[%clk 0:43:13]} 24. Be7 {[%clk 0:50:12]} Nf6
{[%clk 0:41:01]} 25. Qh3 {[%clk 0:50:03]} Re8 {[%clk 0:39:19]} 26. Bb4
{[%clk 0:49:38]} h5 {[%clk 0:34:35]} 27. d4 {[%clk 0:42:13]} exd4
{[%clk 0:27:02]} 28. Nxd4 {[%clk 0:41:56]} Bxd4 {[%clk 0:26:20]} 29. cxd4
{[%clk 0:38:22]} Qc4 {[%clk 0:25:36]} 30. Rab1 {[%clk 0:36:09]} b6
{[%clk 0:19:11]} 31. a5 {[%clk 0:33:15]} bxa5 {[%clk 0:17:48]} 32. Bxa5
{[%clk 0:33:10]} Qxd4 {[%clk 0:17:03]} 33. Bc3 {[%clk 0:32:46]} Qg4
{[%clk 0:16:33]} 34. Qxg4 {[%clk 0:32:40]} hxg4 {[%clk 0:12:50]} 35. Bxf6
{[%clk 0:30:56]} Rxf6 {[%clk 0:11:50]} 36. Rb4 {[%clk 0:28:18]} Re4
{[%clk 0:11:06]} 37. Rxe4 {[%clk 0:26:31]} dxe4 {[%clk 0:11:04]} 38. Re1
{[%clk 0:26:14]} Re6 {[%clk 0:10:30]} 39. g3 {[%clk 0:25:57]} f5 {[%clk 0:07:58]}
40. Kg2 {[%clk 1:26:06]} g5 {[%clk 1:06:45]} 41. h3 {[%clk 1:26:07]} gxh3+
{[%clk 1:07:05]} 42. Kxh3 {[%clk 1:26:32]} Kg6 {[%clk 1:06:27]} 43. Kg2
{[%clk 1:25:00]} Re5 {[%clk 0:54:48]} 44. Ra1 {[%clk 1:20:21]} f4
{[%clk 0:48:26]} 45. Ra6+ {[%clk 1:11:53]} Kf5 {[%clk 0:48:06]} 46. gxf4
{[%clk 1:12:17]} gxf4 {[%clk 0:48:30]} 47. Ra8 {[%clk 1:12:23]} Rb5
{[%clk 0:45:45]} 48. Rh8 {[%clk 1:02:28]} Rb2 {[%clk 0:40:23]} 49. Rf8+
{[%clk 1:02:52]} Ke5 {[%clk 0:40:17]} 50. Re8+ {[%clk 1:03:17]} Kd4
{[%clk 0:40:29]} 51. Rf8 {[%clk 1:03:42]} Ke5 {[%clk 0:38:04]} 52. Re8+
{[%clk 1:04:02]} Kd5 {[%clk 0:37:56]} 53. Rd8+ {[%clk 1:04:27]} Ke5
{[%clk 0:38:11]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.16"]
[Round "7.1"]
[White "So, Wesley"]
[Black "Kramnik, Vladimir"]
[Result "1/2-1/2"]
[BlackElo "2809"]
[WhiteElo "2794"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:57]} Nf6 {[%clk 1:59:54]} 2. c4 {[%clk 1:59:51]} e6
{[%clk 1:59:50]} 3. Nf3 {[%clk 1:59:46]} d5 {[%clk 1:59:46]} 4. Nc3
{[%clk 1:59:42]} Be7 {[%clk 1:59:41]} 5. Bf4 {[%clk 1:59:16]} O-O
{[%clk 1:59:33]} 6. e3 {[%clk 1:59:12]} Nbd7 {[%clk 1:59:29]} 7. a3
{[%clk 1:59:00]} c5 {[%clk 1:59:13]} 8. cxd5 {[%clk 1:58:30]} Nxd5
{[%clk 1:59:06]} 9. Nxd5 {[%clk 1:58:26]} exd5 {[%clk 1:59:03]} 10. dxc5
{[%clk 1:58:20]} Nxc5 {[%clk 1:59:01]} 11. Be2 {[%clk 1:57:51]} Qb6
{[%clk 1:56:53]} 12. b4 {[%clk 1:55:16]} Ne6 {[%clk 1:54:17]} 13. Be5
{[%clk 1:55:04]} a5 {[%clk 1:53:33]} 14. O-O {[%clk 1:54:43]} axb4
{[%clk 1:51:40]} 15. axb4 {[%clk 1:54:38]} Rxa1 {[%clk 1:51:35]} 16. Bxa1
{[%clk 1:54:33]} Rd8 {[%clk 1:50:26]} 17. b5 {[%clk 1:53:18]} Bc5
{[%clk 1:47:15]} 18. Qd2 {[%clk 1:45:37]} d4 {[%clk 1:44:39]} 19. exd4
{[%clk 1:45:04]} Nxd4 {[%clk 1:43:29]} 20. Bxd4 {[%clk 1:44:57]} Bxd4
{[%clk 1:43:25]} 21. Nxd4 {[%clk 1:44:53]} Rxd4 {[%clk 1:40:16]} 22. Qe3
{[%clk 1:44:48]} Be6 {[%clk 1:05:37]} 23. Ra1 {[%clk 1:39:45]} h6
{[%clk 1:05:16]} 24. Ra8+ {[%clk 1:18:00]} Kh7 {[%clk 0:57:06]} 25. Bd3+
{[%clk 1:17:49]} g6 {[%clk 0:54:14]} 26. Ra4 {[%clk 1:17:01]} Rd6
{[%clk 0:49:37]} 27. Qxb6 {[%clk 1:16:57]} Rxb6 {[%clk 0:49:33]} 28. Rd4
{[%clk 1:16:52]} Kg7 {[%clk 0:48:31]} 29. f4 {[%clk 1:16:47]} Kf6
{[%clk 0:47:23]} 30. Kf2 {[%clk 1:16:41]} Bf5 {[%clk 0:43:37]} 31. Bc4
{[%clk 1:10:29]} Ke7 {[%clk 0:43:07]} 32. Ke3 {[%clk 1:10:24]} f6
{[%clk 0:42:10]} 33. h4 {[%clk 1:08:35]} Rd6 {[%clk 0:35:46]} 34. Rxd6
{[%clk 1:08:03]} Kxd6 {[%clk 0:35:41]} 35. Kd4 {[%clk 1:07:59]} b6
{[%clk 0:35:35]} 36. g3 {[%clk 1:07:54]} g5 {[%clk 0:35:20]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.16"]
[Round "7.2"]
[White "Adams, Michael"]
[Black "Caruana, Fabiano"]
[Result "1/2-1/2"]
[BlackElo "2823"]
[WhiteElo "2748"]
[LiveChessVersion "1.4.8"]
[ECO "A37"]

1. c4 {[%clk 1:59:57]} c5 {[%clk 1:59:23]} 2. g3 {[%clk 1:59:52]} g6
{[%clk 1:59:03]} 3. Bg2 {[%clk 1:59:45]} Bg7 {[%clk 1:58:59]} 4. Nc3
{[%clk 1:59:39]} Nc6 {[%clk 1:58:37]} 5. Nf3 {[%clk 1:59:31]} e5 {[%clk 1:58:11]}
6. O-O {[%clk 1:57:03]} d6 {[%clk 1:56:35]} 7. a3 {[%clk 1:55:43]} a5
{[%clk 1:53:47]} 8. Ne1 {[%clk 1:53:47]} Be6 {[%clk 1:53:23]} 9. d3
{[%clk 1:52:37]} Nge7 {[%clk 1:53:15]} 10. Nc2 {[%clk 1:50:43]} d5
{[%clk 1:52:45]} 11. cxd5 {[%clk 1:50:01]} Nxd5 {[%clk 1:52:39]} 12. Ne3
{[%clk 1:48:26]} Nb6 {[%clk 1:52:00]} 13. Nc4 {[%clk 1:35:14]} O-O
{[%clk 1:46:39]} 14. Bxc6 {[%clk 1:26:23]} bxc6 {[%clk 1:46:04]} 15. Nxb6
{[%clk 1:22:28]} Qxb6 {[%clk 1:45:58]} 16. Be3 {[%clk 1:22:17]} Qxb2
{[%clk 1:37:08]} 17. Na4 {[%clk 1:20:07]} Qb3 {[%clk 1:36:39]} 18. Nxc5
{[%clk 1:13:39]} Qxd1 {[%clk 1:36:19]} 19. Rfxd1 {[%clk 1:13:19]} Bd5
{[%clk 1:34:12]} 20. Rab1 {[%clk 1:08:56]} Rfb8 {[%clk 1:29:26]} 21. a4
{[%clk 0:59:53]} f5 {[%clk 1:10:30]} 22. f3 {[%clk 0:53:55]} Ba2 {[%clk 1:02:48]}
23. Rbc1 {[%clk 0:50:27]} Rb2 {[%clk 0:54:43]} 24. Kf1 {[%clk 0:44:59]} Bd5
{[%clk 0:48:17]} 25. Bd2 {[%clk 0:38:15]} Ra2 {[%clk 0:41:47]} 26. Ke1
{[%clk 0:28:24]} Bf8 {[%clk 0:37:25]} 27. Nd7 {[%clk 0:25:53]} Bb3
{[%clk 0:23:56]} 28. Ra1 {[%clk 0:25:29]} Rxa4 {[%clk 0:23:12]} 29. Rxa4
{[%clk 0:24:10]} Bxa4 {[%clk 0:23:08]} 30. Ra1 {[%clk 0:24:01]} Bb3
{[%clk 0:22:46]} 31. Rxa5 {[%clk 0:23:08]} Rxa5 {[%clk 0:22:41]} 32. Bxa5
{[%clk 0:23:05]} Bg7 {[%clk 0:19:58]} 33. Bc3 {[%clk 0:18:24]} Be6
{[%clk 0:17:33]} 34. Nxe5 {[%clk 0:16:42]} Bxe5 {[%clk 0:17:20]} 35. Bxe5
{[%clk 0:16:36]} Kf7 {[%clk 0:17:03]} 36. Kd2 {[%clk 0:14:09]} Bb3
{[%clk 0:16:37]} 37. e4 {[%clk 0:11:34]} Ke6 {[%clk 0:16:30]} 38. Bg7
{[%clk 0:10:42]} h5 {[%clk 0:15:38]} 39. Bf8 {[%clk 0:10:09]} Kf7
{[%clk 0:15:26]} 40. Bc5 {[%clk 1:09:31]} Ke6 {[%clk 1:15:51]} 41. h3
{[%clk 1:09:27]} Ba4 {[%clk 1:16:09]} 42. Ke3 {[%clk 1:05:23]} Bd1
{[%clk 1:16:30]} 43. Bb4 {[%clk 1:03:02]} Kf7 {[%clk 1:16:36]} 44. Kf4
{[%clk 1:02:40]} Ke6 {[%clk 1:16:55]} 45. g4 {[%clk 1:02:11]} fxg4
{[%clk 1:17:03]} 46. fxg4 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.16"]
[Round "7.3"]
[White "Aronian, Levon"]
[Black "Anand, Viswanathan"]
[Result "1/2-1/2"]
[BlackElo "2779"]
[WhiteElo "2785"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:56]} Nf6 {[%clk 1:59:55]} 2. c4 {[%clk 1:59:50]} e6
{[%clk 1:59:51]} 3. Nf3 {[%clk 1:59:42]} d5 {[%clk 1:59:45]} 4. Nc3
{[%clk 1:59:36]} Be7 {[%clk 1:59:39]} 5. Bf4 {[%clk 1:59:29]} O-O
{[%clk 1:59:32]} 6. e3 {[%clk 1:59:24]} c5 {[%clk 1:59:27]} 7. dxc5
{[%clk 1:58:49]} Bxc5 {[%clk 1:59:15]} 8. Bd3 {[%clk 1:54:04]} dxc4
{[%clk 1:57:03]} 9. Bxc4 {[%clk 1:53:57]} Qxd1+ {[%clk 1:56:17]} 10. Rxd1
{[%clk 1:53:49]} Bb4 {[%clk 1:55:59]} 11. Rd3 {[%clk 1:43:36]} Ne4
{[%clk 1:39:59]} 12. O-O {[%clk 1:41:07]} Bxc3 {[%clk 1:36:53]} 13. bxc3
{[%clk 1:40:57]} Nc6 {[%clk 1:31:21]} 14. Bb5 {[%clk 1:33:58]} f6
{[%clk 1:20:33]} 15. Bd6 {[%clk 1:19:36]} Rd8 {[%clk 1:11:35]} 16. Rfd1
{[%clk 1:18:32]} Rxd6 {[%clk 1:06:26]} 17. Rxd6 {[%clk 1:18:24]} Nxd6
{[%clk 1:06:22]} 18. Rxd6 {[%clk 1:18:17]} Kf7 {[%clk 1:05:59]} 19. Bxc6
{[%clk 1:18:02]} Ke7 {[%clk 1:05:54]} 20. Bxb7 {[%clk 1:17:36]} Bxb7
{[%clk 1:05:50]} 21. Rd4 {[%clk 1:17:25]} Rc8 {[%clk 1:05:22]} 22. Rb4
{[%clk 1:17:12]} Bd5 {[%clk 1:03:58]} 23. Ra4 {[%clk 1:17:08]} Rxc3
{[%clk 1:03:36]} 24. Rxa7+ {[%clk 1:17:04]} Kf8 {[%clk 1:03:25]} 25. h3
{[%clk 1:16:48]} Rc1+ {[%clk 1:03:14]} 26. Kh2 {[%clk 1:16:43]} Rc2
{[%clk 1:03:07]} 27. Kg3 {[%clk 1:16:37]} Rxa2 {[%clk 1:03:01]} 28. Rxa2
{[%clk 1:16:33]} Bxa2 {[%clk 1:02:55]} 29. Nd2 {[%clk 1:15:26]} e5
{[%clk 1:02:48]} 30. f4 {[%clk 1:15:20]} exf4+ {[%clk 1:02:42]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.16"]
[Round "7.4"]
[White "Nakamura, Hikaru"]
[Black "Vachier-Lagrave, Maxime"]
[Result "1-0"]
[BlackElo "2804"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "B96"]

1. e4 {[%clk 1:59:56]} c5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:49]} d6
{[%clk 1:59:54]} 3. d4 {[%clk 1:59:13]} cxd4 {[%clk 1:59:49]} 4. Nxd4
{[%clk 1:59:05]} Nf6 {[%clk 1:59:46]} 5. Nc3 {[%clk 1:58:58]} a6 {[%clk 1:59:44]}
6. Bg5 {[%clk 1:58:51]} e6 {[%clk 1:59:39]} 7. f4 {[%clk 1:58:45]} h6
{[%clk 1:59:29]} 8. Bh4 {[%clk 1:58:39]} Qb6 {[%clk 1:59:26]} 9. a3
{[%clk 1:58:30]} Be7 {[%clk 1:59:19]} 10. Bf2 {[%clk 1:58:20]} Qc7
{[%clk 1:59:16]} 11. Qf3 {[%clk 1:57:52]} Nbd7 {[%clk 1:58:07]} 12. O-O-O
{[%clk 1:57:34]} b5 {[%clk 1:58:03]} 13. g4 {[%clk 1:57:09]} Bb7 {[%clk 1:57:58]}
14. Bg2 {[%clk 1:56:47]} Rc8 {[%clk 1:57:03]} 15. Kb1 {[%clk 1:56:25]} g5
{[%clk 1:54:23]} 16. Qh3 {[%clk 1:53:09]} Nc5 {[%clk 1:28:05]} 17. Rhe1
{[%clk 1:34:06]} h5 {[%clk 1:06:34]} 18. Nf5 {[%clk 1:10:14]} Ncxe4
{[%clk 0:53:13]} 19. Bxe4 {[%clk 1:07:42]} Nxe4 {[%clk 0:52:17]} 20. Bd4
{[%clk 1:05:26]} Rg8 {[%clk 0:46:29]} 21. Nxe7 {[%clk 0:53:14]} Kxe7
{[%clk 0:46:11]} 22. gxh5 {[%clk 0:51:34]} gxf4 {[%clk 0:40:09]} 23. Qh4+
{[%clk 0:47:55]} Kf8 {[%clk 0:39:57]} 24. Ka1 {[%clk 0:25:48]} b4
{[%clk 0:29:58]} 25. Nxe4 {[%clk 0:18:49]} Bxe4 {[%clk 0:29:54]} 26. Rxe4
{[%clk 0:18:43]} Qxc2 {[%clk 0:29:50]} 27. Ree1 {[%clk 0:18:08]} bxa3
{[%clk 0:29:04]} 28. Qxf4 {[%clk 0:17:58]} axb2+ {[%clk 0:27:22]} 29. Bxb2
{[%clk 0:17:53]} Rg5 {[%clk 0:27:17]} 30. Qxd6+ {[%clk 0:17:17]} Kg8
{[%clk 0:27:14]} 31. Rg1 {[%clk 0:16:41]} Qa4+ {[%clk 0:25:37]} 32. Ba3
{[%clk 0:12:28]} Rxg1 {[%clk 0:25:27]} 33. Rxg1+ {[%clk 0:12:22]} Kh7
{[%clk 0:25:22]} 34. Qd3+ {[%clk 0:12:04]} Kh6 {[%clk 0:24:16]} 35. Rg6+
{[%clk 0:11:18]} Kxh5 {[%clk 0:24:12]} 36. Rg1 {[%clk 0:11:13]} f5
{[%clk 0:23:56]} 37. Qf3+ {[%clk 0:10:49]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.16"]
[Round "7.5"]
[White "Giri, Anish"]
[Black "Topalov, Veselin"]
[Result "1/2-1/2"]
[BlackElo "2760"]
[WhiteElo "2771"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. c4 Nf6 {[%clk 1:59:49]} 2. d4 {[%clk 1:59:56]} e6 {[%clk 1:59:35]} 3. Nf3
{[%clk 1:59:52]} d5 {[%clk 1:59:23]} 4. Nc3 {[%clk 1:59:45]} Be7 {[%clk 1:59:02]}
5. Bf4 {[%clk 1:59:39]} O-O {[%clk 1:58:44]} 6. e3 {[%clk 1:59:35]} Nbd7
{[%clk 1:57:51]} 7. c5 {[%clk 1:59:12]} c6 {[%clk 1:57:41]} 8. h3
{[%clk 1:58:49]} b6 {[%clk 1:57:06]} 9. b4 {[%clk 1:58:40]} a5 {[%clk 1:56:59]}
10. a3 {[%clk 1:58:36]} h6 {[%clk 1:56:49]} 11. Be2 {[%clk 1:58:31]} Ba6
{[%clk 1:56:30]} 12. O-O {[%clk 1:58:27]} Qc8 {[%clk 1:55:04]} 13. Rb1
{[%clk 1:53:43]} Bxe2 {[%clk 1:52:26]} 14. Qxe2 {[%clk 1:53:39]} axb4
{[%clk 1:51:26]} 15. axb4 {[%clk 1:53:33]} Qb7 {[%clk 1:51:08]} 16. Rfc1
{[%clk 1:53:10]} Rfc8 {[%clk 1:49:15]} 17. Ne1 {[%clk 1:47:28]} Bd8
{[%clk 1:42:01]} 18. Qd1 {[%clk 1:32:24]} Bc7 {[%clk 1:36:04]} 19. Nd3
{[%clk 1:29:55]} b5 {[%clk 1:25:29]} 20. Ra1 {[%clk 1:28:07]} Ne4
{[%clk 1:18:49]} 21. Ne2 {[%clk 1:26:52]} Bd8 {[%clk 1:15:51]} 22. f3
{[%clk 1:22:42]} Nef6 {[%clk 1:15:46]} 23. Nc3 {[%clk 1:22:22]} Nf8
{[%clk 1:03:35]} 24. Rc2 {[%clk 1:08:51]} Ng6 {[%clk 0:59:50]} 25. Rca2
{[%clk 1:08:26]} Rxa2 {[%clk 0:55:11]} 26. Rxa2 {[%clk 1:08:13]} Ra8
{[%clk 0:55:01]} 27. Qa1 {[%clk 1:06:27]} Rxa2 {[%clk 0:54:56]} 28. Qxa2
{[%clk 1:06:23]} Nxf4 {[%clk 0:45:40]} 29. exf4 {[%clk 1:05:42]} Nd7
{[%clk 0:45:29]} 30. Ne2 {[%clk 1:04:28]} Bc7 {[%clk 0:41:27]} 31. h4
{[%clk 1:03:16]} Nb8 {[%clk 0:32:35]} 32. h5 {[%clk 0:50:27]} Qa6
{[%clk 0:31:54]} 33. Qb2 {[%clk 0:50:18]} f6 {[%clk 0:29:52]} 34. g4
{[%clk 0:41:13]} Nd7 {[%clk 0:29:27]} 35. Kf2 {[%clk 0:40:49]} Qa8
{[%clk 0:27:22]} 36. Ke1 {[%clk 0:38:05]} Kf7 {[%clk 0:25:06]} 37. Kd2
{[%clk 0:33:55]} Kg8 {[%clk 0:24:27]} 38. Kd1 {[%clk 0:32:48]} Kf7
{[%clk 0:22:16]} 39. Kc2 {[%clk 0:25:52]} Qa4+ {[%clk 0:21:47]} 40. Kc1
{[%clk 1:25:45]} Qa8 {[%clk 1:21:02]} 41. Kb1 {[%clk 1:22:42]} Qa7
{[%clk 1:17:21]} 42. Qc1 {[%clk 1:16:13]} Qa8 {[%clk 1:10:04]} 43. Kb2
{[%clk 1:09:15]} Bd8 {[%clk 1:06:56]} 44. Qg1 {[%clk 1:05:54]} Be7
{[%clk 1:03:23]} 45. Nec1 {[%clk 1:04:35]} Bd8 {[%clk 1:03:06]} 46. Nb3
{[%clk 1:04:46]} Qb7 {[%clk 1:00:28]} 47. Qe3 {[%clk 1:00:25]} Qa8
{[%clk 0:51:28]} 48. Qc1 {[%clk 0:56:20]} Qa4 {[%clk 0:48:55]} 49. Qe1
{[%clk 0:54:56]} Qa8 {[%clk 0:47:50]} 50. Qd2 {[%clk 0:53:24]} Qa4
{[%clk 0:43:03]} 51. Nf2 {[%clk 0:50:52]} Qa8 {[%clk 0:38:48]} 52. Nh3
{[%clk 0:44:11]} Qc8 {[%clk 0:33:56]} 53. Qc2 {[%clk 0:37:23]} Nf8
{[%clk 0:34:08]} 54. Nc1 {[%clk 0:37:43]} Kg8 {[%clk 0:31:37]} 55. Nd3
{[%clk 0:37:52]} Nh7 {[%clk 0:28:17]} 56. Qe2 {[%clk 0:37:35]} Nf8
{[%clk 0:28:22]} 57. Qe3 {[%clk 0:36:40]} Qd7 {[%clk 0:28:30]} 58. Ng1
{[%clk 0:34:16]} Qe8 {[%clk 0:27:54]} 59. Ne2 {[%clk 0:34:01]} Bc7
{[%clk 0:26:19]} 60. Nec1 {[%clk 0:33:15]} Kf7 {[%clk 0:25:13]} 61. Nb3
{[%clk 0:32:01]} Ke7 {[%clk 0:24:49]} 62. Qe1 {[%clk 0:30:36]} Kd7
{[%clk 0:24:35]} 63. Nbc1 {[%clk 0:29:04]} Kc8 {[%clk 0:22:52]} 64. Ne2
{[%clk 0:27:30]} Nd7 {[%clk 0:22:16]} 65. Ng3 {[%clk 0:27:38]} Qf7
{[%clk 0:22:29]} 66. Qe3 {[%clk 0:27:30]} Kb7 {[%clk 0:22:34]} 67. Ne2
{[%clk 0:25:50]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.15"]
[Round "6.1"]
[White "Topalov, Veselin"]
[Black "So, Wesley"]
[Result "0-1"]
[BlackElo "2794"]
[WhiteElo "2760"]
[LiveChessVersion "1.4.8"]
[ECO "C54"]

1. e4 {[%clk 1:59:55]} e5 {[%clk 1:59:53]} 2. Nf3 {[%clk 1:59:43]} Nc6
{[%clk 1:59:40]} 3. Bc4 {[%clk 1:59:34]} Bc5 {[%clk 1:59:32]} 4. c3
{[%clk 1:59:25]} Nf6 {[%clk 1:59:26]} 5. d3 {[%clk 1:59:17]} a6 {[%clk 1:59:10]}
6. a4 {[%clk 1:56:28]} d6 {[%clk 1:58:40]} 7. Bg5 {[%clk 1:55:51]} Ba7
{[%clk 1:57:16]} 8. Nbd2 {[%clk 1:54:33]} h6 {[%clk 1:54:21]} 9. Bh4
{[%clk 1:54:25]} g5 {[%clk 1:54:16]} 10. Bg3 {[%clk 1:54:21]} O-O
{[%clk 1:54:06]} 11. O-O {[%clk 1:53:42]} Nh7 {[%clk 1:54:02]} 12. h3
{[%clk 1:37:55]} h5 {[%clk 1:45:41]} 13. d4 {[%clk 1:32:41]} exd4
{[%clk 1:29:11]} 14. Nxd4 {[%clk 1:30:18]} g4 {[%clk 1:18:41]} 15. hxg4
{[%clk 1:18:51]} hxg4 {[%clk 1:18:00]} 16. Nxc6 {[%clk 1:10:41]} bxc6
{[%clk 1:17:55]} 17. e5 {[%clk 1:10:10]} d5 {[%clk 1:02:06]} 18. Be2
{[%clk 1:06:22]} Qg5 {[%clk 0:55:13]} 19. a5 {[%clk 0:51:57]} f5 {[%clk 0:45:41]}
20. exf6 {[%clk 0:49:32]} Nxf6 {[%clk 0:45:36]} 21. Ra4 {[%clk 0:48:01]} Rf7
{[%clk 0:39:19]} 22. Re1 {[%clk 0:35:48]} Nh5 {[%clk 0:34:15]} 23. Bxg4
{[%clk 0:35:09]} Nxg3 {[%clk 0:34:08]} 24. Re8+ {[%clk 0:30:50]} Kg7
{[%clk 0:27:51]} 25. Rxc8 {[%clk 0:27:05]} Bxf2+ {[%clk 0:27:09]} 26. Kh2
{[%clk 0:26:59]} Qe5 {[%clk 0:27:06]} 27. Kh3 {[%clk 0:24:03]} Ne2 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.15"]
[Round "6.2"]
[White "Kramnik, Vladimir"]
[Black "Adams, Michael"]
[Result "1/2-1/2"]
[BlackElo "2748"]
[WhiteElo "2809"]
[LiveChessVersion "1.4.8"]
[ECO "D05"]

1. d4 {[%clk 1:59:57]} Nf6 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:48]} d5
{[%clk 1:59:28]} 3. e3 {[%clk 1:59:42]} e6 {[%clk 1:58:06]} 4. Bd3
{[%clk 1:58:35]} b6 {[%clk 1:57:24]} 5. O-O {[%clk 1:57:51]} Bb7 {[%clk 1:57:17]}
6. Nbd2 {[%clk 1:56:58]} Bd6 {[%clk 1:53:27]} 7. Qe2 {[%clk 1:54:02]} Ne4
{[%clk 1:50:30]} 8. b3 {[%clk 1:53:18]} O-O {[%clk 1:49:42]} 9. Bb2
{[%clk 1:53:02]} Nd7 {[%clk 1:47:47]} 10. c4 {[%clk 1:52:03]} a5 {[%clk 1:39:23]}
11. Rfd1 {[%clk 1:42:41]} Qe7 {[%clk 1:37:02]} 12. Rac1 {[%clk 1:36:26]} a4
{[%clk 1:29:22]} 13. Nf1 {[%clk 1:30:47]} axb3 {[%clk 1:10:18]} 14. axb3
{[%clk 1:25:58]} Ra2 {[%clk 1:09:50]} 15. Bb1 {[%clk 1:13:56]} Rxb2
{[%clk 1:09:39]} 16. Qxb2 {[%clk 1:13:50]} Ba3 {[%clk 1:09:37]} 17. Qc2
{[%clk 1:10:28]} c5 {[%clk 0:57:51]} 18. cxd5 {[%clk 1:04:27]} Bxd5
{[%clk 0:52:39]} 19. N3d2 {[%clk 0:47:09]} Ndf6 {[%clk 0:48:26]} 20. f3
{[%clk 0:43:33]} Nxd2 {[%clk 0:46:25]} 21. Nxd2 {[%clk 0:43:16]} g6
{[%clk 0:42:05]} 22. e4 {[%clk 0:33:06]} Bb7 {[%clk 0:40:59]} 23. Nc4
{[%clk 0:32:06]} Bxc1 {[%clk 0:40:33]} 24. Qxc1 {[%clk 0:32:01]} Rd8
{[%clk 0:33:37]} 25. dxc5 {[%clk 0:29:28]} Qxc5+ {[%clk 0:31:51]} 26. Kh1
{[%clk 0:29:21]} Rxd1+ {[%clk 0:24:13]} 27. Qxd1 {[%clk 0:29:19]} Kg7
{[%clk 0:21:23]} 28. Qd2 {[%clk 0:25:47]} Ba6 {[%clk 0:18:26]} 29. Ne3
{[%clk 0:25:31]} Bb5 {[%clk 0:14:31]} 30. Nc2 {[%clk 0:22:37]} h5
{[%clk 0:12:43]} 31. h4 {[%clk 0:15:06]} Nd7 {[%clk 0:11:27]} 32. b4
{[%clk 0:10:13]} Qe7 {[%clk 0:08:36]} 33. g3 {[%clk 0:10:01]} Qf6
{[%clk 0:07:22]} 34. Nd4 {[%clk 0:08:17]} e5 {[%clk 0:05:36]} 35. Nxb5
{[%clk 0:06:11]} Qxf3+ {[%clk 0:05:34]} 36. Qg2 {[%clk 0:05:24]} Qd1+
{[%clk 0:05:31]} 37. Qg1 {[%clk 0:05:22]} Qf3+ {[%clk 0:05:09]} 38. Qg2
{[%clk 0:05:16]} Qd1+ {[%clk 0:05:05]} 39. Qg1 {[%clk 0:05:12]} Qf3+
{[%clk 0:03:00]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.15"]
[Round "6.3"]
[White "Caruana, Fabiano"]
[Black "Nakamura, Hikaru"]
[Result "1-0"]
[BlackElo "2779"]
[WhiteElo "2823"]
[LiveChessVersion "1.4.8"]
[ECO "B96"]

1. e4 {[%clk 1:59:57]} c5 {[%clk 1:59:50]} 2. Nf3 {[%clk 1:59:52]} d6
{[%clk 1:59:45]} 3. d4 {[%clk 1:59:48]} cxd4 {[%clk 1:59:39]} 4. Nxd4
{[%clk 1:59:44]} Nf6 {[%clk 1:59:24]} 5. Nc3 {[%clk 1:59:39]} a6 {[%clk 1:59:19]}
6. Bg5 {[%clk 1:59:26]} e6 {[%clk 1:59:01]} 7. f4 {[%clk 1:59:15]} h6
{[%clk 1:58:56]} 8. Bh4 {[%clk 1:59:08]} Qb6 {[%clk 1:58:40]} 9. a3
{[%clk 1:58:15]} Be7 {[%clk 1:57:01]} 10. Bf2 {[%clk 1:57:06]} Qc7
{[%clk 1:56:55]} 11. Qf3 {[%clk 1:56:14]} Nbd7 {[%clk 1:55:27]} 12. O-O-O
{[%clk 1:55:28]} b5 {[%clk 1:55:14]} 13. g4 {[%clk 1:54:58]} g5 {[%clk 1:54:02]}
14. h4 {[%clk 1:53:31]} gxf4 {[%clk 1:53:00]} 15. Be2 {[%clk 1:53:03]} b4
{[%clk 1:51:04]} 16. axb4 {[%clk 1:52:37]} Ne5 {[%clk 1:50:58]} 17. Qxf4
{[%clk 1:52:17]} Nexg4 {[%clk 1:50:23]} 18. Bxg4 {[%clk 1:51:12]} e5
{[%clk 1:50:16]} 19. Qxf6 {[%clk 1:50:37]} Bxf6 {[%clk 1:50:10]} 20. Nd5
{[%clk 1:50:30]} Qd8 {[%clk 1:50:06]} 21. Nf5 {[%clk 1:49:26]} Rb8
{[%clk 1:14:47]} 22. Nxf6+ {[%clk 1:32:09]} Qxf6 {[%clk 1:13:23]} 23. Rxd6
{[%clk 1:27:37]} Be6 {[%clk 1:13:07]} 24. Rhd1 {[%clk 1:06:22]} O-O
{[%clk 0:59:57]} 25. h5 {[%clk 1:01:39]} Qg5+ {[%clk 0:59:40]} 26. Be3
{[%clk 1:01:28]} Qf6 {[%clk 0:59:38]} 27. Nxh6+ {[%clk 0:56:36]} Kh8
{[%clk 0:58:22]} 28. Bf5 {[%clk 0:34:10]} Qe7 {[%clk 0:28:19]} 29. b5
{[%clk 0:19:33]} Qe8 {[%clk 0:20:40]} 30. Nxf7+ {[%clk 0:13:56]} Rxf7
{[%clk 0:20:13]} 31. Rxe6 {[%clk 0:13:50]} Qxb5 {[%clk 0:20:08]} 32. Rh6+
{[%clk 0:12:58]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.15"]
[Round "6.4"]
[White "Anand, Viswanathan"]
[Black "Giri, Anish"]
[Result "1/2-1/2"]
[BlackElo "2771"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "B90"]

1. e4 {[%clk 1:59:57]} c5 {[%clk 1:59:58]} 2. Nf3 {[%clk 1:59:49]} d6
{[%clk 1:59:54]} 3. d4 {[%clk 1:59:43]} cxd4 {[%clk 1:59:51]} 4. Nxd4
{[%clk 1:59:36]} Nf6 {[%clk 1:59:47]} 5. Nc3 {[%clk 1:59:29]} a6 {[%clk 1:59:44]}
6. h3 {[%clk 1:59:20]} e6 {[%clk 1:59:41]} 7. g4 {[%clk 1:59:06]} Be7
{[%clk 1:59:37]} 8. g5 {[%clk 1:57:29]} Nfd7 {[%clk 1:59:29]} 9. h4
{[%clk 1:57:25]} b5 {[%clk 1:59:04]} 10. a3 {[%clk 1:56:51]} Bb7 {[%clk 1:58:58]}
11. Be3 {[%clk 1:53:22]} Nc6 {[%clk 1:58:27]} 12. Qd2 {[%clk 1:51:40]} O-O
{[%clk 1:58:13]} 13. O-O-O {[%clk 1:51:08]} Nc5 {[%clk 1:57:05]} 14. f3
{[%clk 1:42:12]} Rb8 {[%clk 1:56:57]} 15. Rg1 {[%clk 1:32:38]} Qc7
{[%clk 1:48:19]} 16. b4 {[%clk 1:23:02]} Nd7 {[%clk 1:30:36]} 17. Ndxb5
{[%clk 1:19:27]} axb5 {[%clk 1:30:15]} 18. Nxb5 {[%clk 1:19:18]} Qc8
{[%clk 1:25:12]} 19. Nxd6 {[%clk 1:12:42]} Bxd6 {[%clk 1:24:56]} 20. Qxd6
{[%clk 1:12:35]} Rd8 {[%clk 1:18:35]} 21. b5 {[%clk 0:56:35]} Nde5
{[%clk 1:13:43]} 22. Qc5 {[%clk 0:56:16]} Rxd1+ {[%clk 1:13:25]} 23. Kxd1
{[%clk 0:56:10]} Nxf3 {[%clk 1:12:48]} 24. bxc6 {[%clk 0:50:28]} Bxc6
{[%clk 1:11:19]} 25. Rg3 {[%clk 0:42:22]} Rb1+ {[%clk 1:05:04]} 26. Ke2
{[%clk 0:41:09]} Qa6+ {[%clk 0:39:53]} 27. Kxf3 {[%clk 0:40:17]} Qxf1+
{[%clk 0:35:21]} 28. Bf2 {[%clk 0:40:03]} Qh1+ {[%clk 0:27:09]} 29. Ke3
{[%clk 0:39:30]} Qc1+ {[%clk 0:21:20]} 30. Kf3 {[%clk 0:37:24]} Qd1+
{[%clk 0:20:47]} 31. Ke3 {[%clk 0:37:18]} Qc1+ {[%clk 0:19:07]} 32. Kf3
{[%clk 0:37:04]} Qh1+ {[%clk 0:19:05]} 33. Ke3 {[%clk 0:36:53]} Qxe4+
{[%clk 0:18:59]} 34. Kd2 {[%clk 0:36:47]} Qf4+ {[%clk 0:17:54]} 35. Kc3
{[%clk 0:33:48]} Rb8 {[%clk 0:11:29]} 36. Rd3 {[%clk 0:32:24]} Rc8
{[%clk 0:10:33]} 37. Kb2 {[%clk 0:30:21]} h5 {[%clk 0:10:08]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.15"]
[Round "6.5"]
[White "Vachier-Lagrave, Maxime"]
[Black "Aronian, Levon"]
[Result "1-0"]
[BlackElo "2785"]
[WhiteElo "2804"]
[LiveChessVersion "1.4.8"]
[ECO "C50"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:53]} Nc6
{[%clk 1:59:50]} 3. Bc4 {[%clk 1:59:50]} Bc5 {[%clk 1:59:41]} 4. O-O
{[%clk 1:59:45]} Nf6 {[%clk 1:59:36]} 5. d3 {[%clk 1:59:43]} O-O {[%clk 1:59:26]}
6. a4 {[%clk 1:59:40]} a5 {[%clk 1:59:08]} 7. c3 {[%clk 1:59:01]} d5
{[%clk 1:59:01]} 8. exd5 {[%clk 1:58:25]} Nxd5 {[%clk 1:58:56]} 9. Re1
{[%clk 1:49:21]} Bg4 {[%clk 1:58:45]} 10. Nbd2 {[%clk 1:48:35]} Nb6
{[%clk 1:58:37]} 11. Bb5 {[%clk 1:44:33]} Bd6 {[%clk 1:58:30]} 12. h3
{[%clk 1:40:05]} Bh5 {[%clk 1:58:05]} 13. Ne4 {[%clk 1:37:34]} f5
{[%clk 1:57:57]} 14. Ng3 {[%clk 1:34:01]} Bxf3 {[%clk 1:57:43]} 15. Qxf3
{[%clk 1:33:20]} Ne7 {[%clk 1:57:38]} 16. Bg5 {[%clk 1:24:08]} c6
{[%clk 1:51:18]} 17. Bc4+ {[%clk 1:23:52]} Nxc4 {[%clk 1:50:52]} 18. dxc4
{[%clk 1:23:45]} e4 {[%clk 1:19:29]} 19. Nxe4 {[%clk 1:21:03]} fxe4
{[%clk 1:19:24]} 20. Qxe4 {[%clk 1:20:57]} Rf7 {[%clk 1:18:25]} 21. Rad1
{[%clk 1:19:24]} Qc7 {[%clk 1:17:56]} 22. Rxd6 {[%clk 1:18:24]} Qxd6
{[%clk 1:16:23]} 23. Bxe7 {[%clk 1:18:08]} Qd2 {[%clk 1:15:47]} 24. Bc5
{[%clk 1:17:17]} h6 {[%clk 1:15:38]} 25. Qe2 {[%clk 1:12:46]} Rd8
{[%clk 1:13:18]} 26. Bd4 {[%clk 1:11:50]} Qg5 {[%clk 1:02:37]} 27. Qg4
{[%clk 1:00:31]} Re7 {[%clk 0:59:07]} 28. Rxe7 {[%clk 0:56:42]} Qxe7
{[%clk 0:58:51]} 29. Qf5 {[%clk 0:54:59]} Re8 {[%clk 0:55:10]} 30. Qxa5
{[%clk 0:52:05]} Qf7 {[%clk 0:54:18]} 31. Kh2 {[%clk 0:46:34]} Qf4+
{[%clk 0:50:01]} 32. g3 {[%clk 0:46:18]} Qf7 {[%clk 0:49:55]} 33. Kg2
{[%clk 0:37:36]} Re1 {[%clk 0:47:15]} 34. g4 {[%clk 0:35:14]} Rd1
{[%clk 0:31:06]} 35. Qe5 {[%clk 0:31:34]} Qg6 {[%clk 0:21:47]} 36. b4
{[%clk 0:27:45]} b6 {[%clk 0:14:47]} 37. Bxb6 {[%clk 0:24:04]} c5
{[%clk 0:08:34]} 38. Bxc5 {[%clk 0:23:10]} Qc6+ {[%clk 0:08:29]} 39. f3
{[%clk 0:21:09]} Rd3 {[%clk 0:06:15]} 40. Qb8+ {[%clk 1:21:04]} Kh7
{[%clk 1:06:10]} 41. Qf4 {[%clk 1:21:28]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.13"]
[Round "5.1"]
[White "So, Wesley"]
[Black "Anand, Viswanathan"]
[Result "1/2-1/2"]
[BlackElo "2779"]
[WhiteElo "2794"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:57]} Nf6 {[%clk 1:59:53]} 2. c4 {[%clk 1:59:50]} e6
{[%clk 1:59:48]} 3. Nf3 {[%clk 1:59:47]} d5 {[%clk 1:59:42]} 4. Nc3
{[%clk 1:59:43]} Nbd7 {[%clk 1:59:35]} 5. Bf4 {[%clk 1:59:37]} dxc4
{[%clk 1:59:07]} 6. e3 {[%clk 1:59:32]} b5 {[%clk 1:58:41]} 7. Nxb5
{[%clk 1:59:26]} Bb4+ {[%clk 1:58:32]} 8. Nc3 {[%clk 1:59:21]} Nd5
{[%clk 1:57:49]} 9. a3 {[%clk 1:59:12]} Nxc3 {[%clk 1:57:34]} 10. Qd2
{[%clk 1:59:07]} Bxa3 {[%clk 1:57:17]} 11. Qxc3 {[%clk 1:27:43]} Bd6
{[%clk 1:55:56]} 12. Bxd6 {[%clk 1:23:40]} cxd6 {[%clk 1:55:47]} 13. Bxc4
{[%clk 1:23:36]} O-O {[%clk 1:53:45]} 14. O-O {[%clk 1:23:00]} Bb7
{[%clk 1:52:29]} 15. Be2 {[%clk 1:22:55]} Qb6 {[%clk 1:48:21]} 16. Rfc1
{[%clk 1:21:10]} Rfc8 {[%clk 1:41:56]} 17. Qa3 {[%clk 1:21:04]} Bxf3
{[%clk 1:36:21]} 18. Bxf3 {[%clk 1:20:58]} Rab8 {[%clk 1:34:53]} 19. h4
{[%clk 1:13:18]} Rxc1+ {[%clk 1:33:22]} 20. Rxc1 {[%clk 1:13:13]} Qxb2
{[%clk 1:32:35]} 21. Qxb2 {[%clk 1:13:10]} Rxb2 {[%clk 1:32:28]} 22. Rc7
{[%clk 1:13:07]} Nf8 {[%clk 1:32:16]} 23. Rxa7 {[%clk 1:13:02]} d5
{[%clk 1:32:08]} 24. Ra8 {[%clk 1:12:54]} g6 {[%clk 1:31:53]} 25. g3
{[%clk 1:12:47]} h5 {[%clk 1:31:48]} 26. g4 {[%clk 1:12:27]} hxg4
{[%clk 1:31:43]} 27. Bxg4 {[%clk 1:12:25]} Kg7 {[%clk 1:31:35]} 28. h5
{[%clk 1:12:20]} gxh5 {[%clk 1:31:31]} 29. Bxh5 {[%clk 1:12:16]} Ng6
{[%clk 1:31:24]} 30. Bxg6 {[%clk 1:12:14]} Kxg6 {[%clk 1:31:17]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.13"]
[Round "5.2"]
[White "Vachier-Lagrave, Maxime"]
[Black "Caruana, Fabiano"]
[Result "1/2-1/2"]
[BlackElo "2823"]
[WhiteElo "2804"]
[LiveChessVersion "1.4.8"]
[ECO "C42"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:54]} 2. Nf3 {[%clk 1:59:54]} Nf6
{[%clk 1:59:48]} 3. Nxe5 {[%clk 1:58:58]} d6 {[%clk 1:59:42]} 4. Nf3
{[%clk 1:58:54]} Nxe4 {[%clk 1:59:38]} 5. Nc3 {[%clk 1:58:15]} Nxc3
{[%clk 1:59:31]} 6. dxc3 {[%clk 1:58:12]} Be7 {[%clk 1:59:23]} 7. Be3
{[%clk 1:58:07]} Nc6 {[%clk 1:59:13]} 8. Qd2 {[%clk 1:57:55]} Be6
{[%clk 1:59:04]} 9. O-O-O {[%clk 1:57:20]} Qd7 {[%clk 1:58:57]} 10. b3
{[%clk 1:56:46]} O-O-O {[%clk 1:57:58]} 11. Nd4 {[%clk 1:51:17]} a6
{[%clk 1:57:39]} 12. Nxe6 {[%clk 1:50:38]} fxe6 {[%clk 1:57:33]} 13. g3
{[%clk 1:50:03]} d5 {[%clk 1:53:21]} 14. Bh3 {[%clk 1:47:20]} Kb8
{[%clk 1:50:50]} 15. Rhe1 {[%clk 1:45:28]} Rhe8 {[%clk 1:47:30]} 16. f4
{[%clk 1:32:46]} Bf6 {[%clk 1:35:19]} 17. Kb1 {[%clk 1:27:23]} Qd6
{[%clk 1:31:43]} 18. Qd3 {[%clk 1:23:49]} e5 {[%clk 1:25:46]} 19. Bc1
{[%clk 0:59:07]} e4 {[%clk 1:21:22]} 20. Qd2 {[%clk 0:58:51]} Qc5
{[%clk 0:54:12]} 21. Bb2 {[%clk 0:58:38]} d4 {[%clk 0:53:45]} 22. Qe2
{[%clk 0:57:29]} dxc3 {[%clk 0:51:48]} 23. Rxd8+ {[%clk 0:57:11]} Rxd8
{[%clk 0:49:16]} 24. Bc1 {[%clk 0:57:04]} Rd2 {[%clk 0:43:55]} 25. Bxd2
{[%clk 0:44:38]} cxd2 {[%clk 0:43:49]} 26. Qxd2 {[%clk 0:44:35]} Bc3
{[%clk 0:32:34]} 27. Qc1 {[%clk 0:41:54]} Bxe1 {[%clk 0:29:20]} 28. Qxe1
{[%clk 0:41:46]} e3 {[%clk 0:28:18]} 29. c3 {[%clk 0:40:25]} Na7 {[%clk 0:26:24]}
30. Bf1 {[%clk 0:35:51]} Nb5 {[%clk 0:24:46]} 31. Kb2 {[%clk 0:34:20]} Qa3+
{[%clk 0:17:52]} 32. Kb1 {[%clk 0:33:53]} Qc5 {[%clk 0:17:43]} 33. Kb2
{[%clk 0:33:49]} Qa3+ {[%clk 0:17:03]} 34. Kb1 {[%clk 0:33:42]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.13"]
[Round "5.3"]
[White "Nakamura, Hikaru"]
[Black "Kramnik, Vladimir"]
[Result "1/2-1/2"]
[BlackElo "2809"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:43]} Nf6 {[%clk 1:59:53]} 2. c4 {[%clk 1:59:31]} e6
{[%clk 1:59:50]} 3. Nf3 {[%clk 1:59:20]} d5 {[%clk 1:59:43]} 4. Nc3
{[%clk 1:59:07]} Be7 {[%clk 1:59:32]} 5. Bf4 {[%clk 1:58:43]} O-O
{[%clk 1:59:23]} 6. e3 {[%clk 1:58:40]} Nbd7 {[%clk 1:59:18]} 7. c5
{[%clk 1:58:23]} Nh5 {[%clk 1:59:05]} 8. Bd3 {[%clk 1:58:02]} Nxf4
{[%clk 1:58:50]} 9. exf4 {[%clk 1:57:56]} b6 {[%clk 1:58:47]} 10. b4
{[%clk 1:57:39]} a5 {[%clk 1:58:40]} 11. a3 {[%clk 1:57:34]} c6 {[%clk 1:58:31]}
12. O-O {[%clk 1:57:24]} Ba6 {[%clk 1:58:22]} 13. Re1 {[%clk 1:56:33]} Bf6
{[%clk 1:57:28]} 14. Ne5 {[%clk 1:54:36]} Bxe5 {[%clk 1:56:32]} 15. fxe5
{[%clk 1:54:28]} Bxd3 {[%clk 1:56:28]} 16. Qxd3 {[%clk 1:54:20]} Ra7
{[%clk 1:54:18]} 17. g3 {[%clk 1:36:10]} Qa8 {[%clk 1:48:13]} 18. Rab1
{[%clk 1:34:47]} axb4 {[%clk 1:44:16]} 19. axb4 {[%clk 1:34:14]} Ra3
{[%clk 1:42:27]} 20. Qc2 {[%clk 1:30:55]} Rb8 {[%clk 1:31:53]} 21. h4
{[%clk 1:24:03]} h6 {[%clk 1:29:59]} 22. Kg2 {[%clk 1:20:45]} Qa6
{[%clk 1:21:09]} 23. Rec1 {[%clk 1:02:41]} bxc5 {[%clk 1:10:54]} 24. bxc5
{[%clk 1:02:35]} Rxb1 {[%clk 1:10:35]} 25. Qxb1 {[%clk 1:02:14]} Qc4
{[%clk 1:08:12]} 26. Qb2 {[%clk 0:59:38]} Rb3 {[%clk 1:04:19]} 27. Qd2
{[%clk 0:59:25]} Qb4 {[%clk 0:58:11]} 28. Rc2 {[%clk 0:58:17]} f6
{[%clk 0:52:19]} 29. f4 {[%clk 0:57:24]} fxe5 {[%clk 0:48:16]} 30. fxe5
{[%clk 0:57:03]} Nf8 {[%clk 0:36:32]} 31. Ne2 {[%clk 0:52:08]} Qb7
{[%clk 0:27:56]} 32. Nf4 {[%clk 0:47:50]} Qf7 {[%clk 0:17:13]} 33. Rb2
{[%clk 0:46:47]} Rxb2 {[%clk 0:16:00]} 34. Qxb2 {[%clk 0:46:40]} g5
{[%clk 0:12:08]} 35. hxg5 {[%clk 0:46:22]} hxg5 {[%clk 0:12:06]} 36. Nd3
{[%clk 0:41:12]} Ng6 {[%clk 0:08:46]} 37. Nf2 {[%clk 0:40:10]} Ne7
{[%clk 0:06:02]} 38. Qd2 {[%clk 0:38:07]} Qg6 {[%clk 0:05:05]} 39. g4
{[%clk 0:37:42]} Kg7 {[%clk 0:04:00]} 40. Nh3 {[%clk 1:35:56]} Kh6
{[%clk 1:03:37]} 41. Kg3 {[%clk 1:35:53]} Nc8 {[%clk 0:54:15]} 42. Qf2
{[%clk 1:17:18]} Kg7 {[%clk 0:53:13]} 43. Qe3 {[%clk 1:17:31]} Kh6
{[%clk 0:52:54]} 44. Qf3 {[%clk 1:14:04]} Kg7 {[%clk 0:52:33]} 45. Qa3
{[%clk 0:43:45]} Qe4 {[%clk 0:43:57]} 46. Nxg5 {[%clk 0:34:43]} Qe1+
{[%clk 0:44:21]} 47. Kf4 {[%clk 0:34:44]} Qf2+ {[%clk 0:40:55]} 48. Nf3
{[%clk 0:35:09]} Ne7 {[%clk 0:40:57]} 49. Qa7 {[%clk 0:30:56]} Kf8
{[%clk 0:40:03]} 50. Qb8+ {[%clk 0:24:40]} Kf7 {[%clk 0:40:05]} 51. Qb7
{[%clk 0:24:46]} Kf8 {[%clk 0:38:12]} 52. Qd7 {[%clk 0:21:20]} Ng6+
{[%clk 0:35:50]} 53. Kg5 {[%clk 0:21:45]} Qxf3 {[%clk 0:36:08]} 54. Qxe6
{[%clk 0:21:20]} Nh8 {[%clk 0:29:45]} 55. Qf5+ {[%clk 0:21:18]} Nf7+
{[%clk 0:27:30]} 56. Kf6 {[%clk 0:21:06]} Qxf5+ {[%clk 0:27:54]} 57. gxf5
{[%clk 0:20:29]} Nd8 {[%clk 0:28:18]} 58. e6 {[%clk 0:12:43]} Nf7
{[%clk 0:28:36]} 59. Kg6 {[%clk 0:08:21]} Nd8 {[%clk 0:28:51]} 60. Kf6
{[%clk 0:08:48]} Nf7 {[%clk 0:29:16]} 61. exf7 {[%clk 0:09:15]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.13"]
[Round "5.4"]
[White "Aronian, Levon"]
[Black "Giri, Anish"]
[Result "1/2-1/2"]
[BlackElo "2771"]
[WhiteElo "2785"]
[LiveChessVersion "1.4.8"]
[ECO "A06"]

1. g3 {[%clk 1:59:55]} d5 {[%clk 1:59:31]} 2. Nf3 {[%clk 1:59:49]} g6
{[%clk 1:59:29]} 3. Bg2 {[%clk 1:59:43]} Bg7 {[%clk 1:59:25]} 4. d4
{[%clk 1:59:38]} Nf6 {[%clk 1:59:22]} 5. O-O {[%clk 1:59:31]} O-O
{[%clk 1:59:20]} 6. c4 {[%clk 1:59:26]} dxc4 {[%clk 1:59:11]} 7. Na3
{[%clk 1:59:19]} c5 {[%clk 1:59:10]} 8. Nxc4 {[%clk 1:55:11]} Be6
{[%clk 1:58:26]} 9. b3 {[%clk 1:53:26]} Nc6 {[%clk 1:58:09]} 10. Bb2
{[%clk 1:53:01]} cxd4 {[%clk 1:57:49]} 11. Nxd4 {[%clk 1:52:04]} Nxd4
{[%clk 1:57:43]} 12. Bxd4 {[%clk 1:46:39]} b6 {[%clk 1:57:29]} 13. Rc1
{[%clk 1:41:25]} Rc8 {[%clk 1:49:30]} 14. Rc2 {[%clk 1:33:37]} b5
{[%clk 1:42:33]} 15. Ne3 {[%clk 1:33:32]} Rxc2 {[%clk 1:37:41]} 16. Nxc2
{[%clk 1:33:05]} Qa5 {[%clk 1:33:46]} 17. Qa1 {[%clk 1:32:41]} Qd2
{[%clk 1:27:06]} 18. Qd1 {[%clk 1:32:35]} Qa5 {[%clk 1:26:51]} 19. Qa1
{[%clk 1:32:30]} Qd2 {[%clk 1:26:38]} 20. Qd1 {[%clk 1:32:07]} Qa5
{[%clk 1:26:33]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.13"]
[Round "5.5"]
[White "Adams, Michael"]
[Black "Topalov, Veselin"]
[Result "1-0"]
[BlackElo "2760"]
[WhiteElo "2748"]
[LiveChessVersion "1.4.8"]
[ECO "C65"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:53]} Nc6
{[%clk 1:59:51]} 3. Bb5 {[%clk 1:59:49]} Nf6 {[%clk 1:59:46]} 4. d3
{[%clk 1:59:43]} Bc5 {[%clk 1:59:38]} 5. Bxc6 {[%clk 1:59:36]} dxc6
{[%clk 1:59:33]} 6. Nbd2 {[%clk 1:59:29]} Be6 {[%clk 1:58:46]} 7. O-O
{[%clk 1:59:21]} Bd6 {[%clk 1:53:22]} 8. d4 {[%clk 1:58:44]} Nd7 {[%clk 1:52:44]}
9. Nxe5 {[%clk 1:57:25]} Nxe5 {[%clk 1:52:04]} 10. dxe5 {[%clk 1:57:19]} Bxe5
{[%clk 1:52:01]} 11. f4 {[%clk 1:57:10]} Bd4+ {[%clk 1:47:22]} 12. Kh1
{[%clk 1:57:02]} f6 {[%clk 1:45:15]} 13. c3 {[%clk 1:54:33]} Bb6 {[%clk 1:41:55]}
14. f5 {[%clk 1:45:59]} Bf7 {[%clk 1:41:20]} 15. e5 {[%clk 1:43:08]} fxe5
{[%clk 1:34:58]} 16. Qg4 {[%clk 1:41:46]} Qd3 {[%clk 1:00:39]} 17. Qxg7
{[%clk 1:38:49]} Rg8 {[%clk 0:59:23]} 18. Qxe5+ {[%clk 1:37:28]} Kd7
{[%clk 0:46:08]} 19. Qe4 {[%clk 1:31:19]} Qa6 {[%clk 0:43:07]} 20. f6
{[%clk 1:07:26]} Rae8 {[%clk 0:35:30]} 21. Qf5+ {[%clk 1:05:13]} Kd8
{[%clk 0:34:38]} 22. c4 {[%clk 0:56:30]} Qa5 {[%clk 0:20:20]} 23. Qh3
{[%clk 0:47:50]} Qb4 {[%clk 0:09:48]} 24. Qxh7 {[%clk 0:35:19]} Qf8
{[%clk 0:05:09]} 25. b3 {[%clk 0:22:31]} Bd4 {[%clk 0:04:17]} 26. Qd3
{[%clk 0:21:49]} Qd6 {[%clk 0:04:06]} 27. Ne4 {[%clk 0:15:08]} Qd7
{[%clk 0:02:15]} 28. Rd1 {[%clk 0:12:19]} Kc8 {[%clk 0:01:37]} 29. Qxd4
{[%clk 0:07:56]} Qg4 {[%clk 0:01:28]} 30. Bg5 {[%clk 0:05:34]} Rxe4
{[%clk 0:00:27]} 31. Qxa7 {[%clk 0:05:26]} Bd5 {[%clk 0:00:09]} 32. Qa8+
{[%clk 0:04:36]} Kd7 {[%clk 0:00:06]} 33. Rxd5+ {[%clk 0:04:29]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.12"]
[Round "4.1"]
[White "Giri, Anish"]
[Black "So, Wesley"]
[Result "1/2-1/2"]
[BlackElo "2794"]
[WhiteElo "2771"]
[LiveChessVersion "1.4.8"]
[ECO "D02"]

1. d4 {[%clk 1:59:58]} Nf6 {[%clk 1:59:52]} 2. Nf3 {[%clk 1:59:54]} d5
{[%clk 1:59:43]} 3. Bf4 {[%clk 1:58:51]} c5 {[%clk 1:58:38]} 4. e3
{[%clk 1:58:10]} Nc6 {[%clk 1:58:32]} 5. Nbd2 {[%clk 1:58:00]} e6
{[%clk 1:58:26]} 6. c3 {[%clk 1:57:30]} cxd4 {[%clk 1:55:10]} 7. exd4
{[%clk 1:53:33]} Nh5 {[%clk 1:55:02]} 8. Bg5 {[%clk 1:42:54]} f6 {[%clk 1:49:17]}
9. Be3 {[%clk 1:39:05]} Bd6 {[%clk 1:48:52]} 10. g3 {[%clk 1:35:16]} O-O
{[%clk 1:46:07]} 11. Bg2 {[%clk 1:34:28]} f5 {[%clk 1:32:22]} 12. Ne5
{[%clk 1:28:08]} f4 {[%clk 1:31:07]} 13. Qxh5 {[%clk 0:57:57]} fxe3
{[%clk 1:30:14]} 14. fxe3 {[%clk 0:57:52]} Nxe5 {[%clk 1:29:08]} 15. dxe5
{[%clk 0:56:49]} Bc5 {[%clk 1:28:50]} 16. Rf1 {[%clk 0:55:14]} Bxe3
{[%clk 1:21:00]} 17. Rxf8+ {[%clk 0:48:42]} Qxf8 {[%clk 1:20:52]} 18. Qf3
{[%clk 0:47:53]} Qxf3 {[%clk 1:14:16]} 19. Nxf3 {[%clk 0:47:42]} Bd7
{[%clk 1:14:13]} 20. Rd1 {[%clk 0:42:32]} Rf8 {[%clk 1:06:51]} 21. c4
{[%clk 0:39:24]} Bc6 {[%clk 1:04:50]} 22. Nd4 {[%clk 0:37:26]} Bxd4
{[%clk 1:02:42]} 23. Rxd4 {[%clk 0:37:17]} Rf5 {[%clk 1:02:37]} 24. g4
{[%clk 0:25:33]} Rxe5+ {[%clk 1:02:17]} 25. Kf2 {[%clk 0:25:24]} Kf7
{[%clk 0:59:04]} 26. b4 {[%clk 0:23:53]} Ke7 {[%clk 0:49:46]} 27. b5
{[%clk 0:23:05]} Bd7 {[%clk 0:49:37]} 28. b6 {[%clk 0:22:23]} dxc4
{[%clk 0:46:23]} 29. Rxc4 {[%clk 0:18:52]} axb6 {[%clk 0:45:43]} 30. Rc7
{[%clk 0:17:22]} Rb5 {[%clk 0:40:35]} 31. Rxb7 {[%clk 0:17:13]} Kd6
{[%clk 0:40:30]} 32. Kg3 {[%clk 0:16:45]} h6 {[%clk 0:37:33]} 33. Rb8
{[%clk 0:15:18]} Rb2 {[%clk 0:36:21]} 34. Bf3 {[%clk 0:14:46]} b5
{[%clk 0:15:51]} 35. a4 {[%clk 0:14:12]} b4 {[%clk 0:13:55]} 36. a5
{[%clk 0:14:02]} Rb3 {[%clk 0:07:41]} 37. Kg2 {[%clk 0:13:58]} Bc6
{[%clk 0:02:50]} 38. Bxc6 {[%clk 0:13:33]} Kxc6 {[%clk 0:02:47]} 39. a6
{[%clk 0:13:27]} Ra3 {[%clk 0:02:42]} 40. Rxb4 {[%clk 1:13:52]} Rxa6
{[%clk 1:02:57]} 41. h4 {[%clk 1:08:21]} e5 {[%clk 0:56:18]} 42. Kf3
{[%clk 1:06:22]} Kd5 {[%clk 0:56:43]} 43. Rb5+ {[%clk 1:06:13]} Ke6
{[%clk 0:57:06]} 44. Rb7 {[%clk 1:06:37]} Kf6 {[%clk 0:57:24]} 45. g5+
{[%clk 1:05:55]} hxg5 {[%clk 0:57:47]} 46. hxg5+ {[%clk 1:06:23]} Kg6
{[%clk 0:58:12]} 47. Re7 {[%clk 1:06:10]} Ra5 {[%clk 0:58:06]} 48. Ke3
{[%clk 1:03:26]} Rb5 {[%clk 0:57:07]} 49. Kf3 {[%clk 1:03:26]} Rb3+
{[%clk 0:57:00]} 50. Kf2 {[%clk 1:03:32]} Rb5 {[%clk 0:57:26]} 51. Kf3
{[%clk 1:03:59]} Rd5 {[%clk 0:57:52]} 52. Ke3 {[%clk 1:04:00]} e4
{[%clk 0:58:17]} 53. Kxe4 {[%clk 1:04:18]} Rxg5 {[%clk 0:58:43]} 54. Kf3
{[%clk 1:04:37]} Kh5 {[%clk 0:59:08]} 55. Re1 {[%clk 1:04:49]} Rg4
{[%clk 0:59:32]} 56. Rh1+ {[%clk 1:04:47]} Kg5 {[%clk 0:59:56]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.12"]
[Round "4.2"]
[White "Kramnik, Vladimir"]
[Black "Vachier-Lagrave, Maxime"]
[Result "1/2-1/2"]
[BlackElo "2804"]
[WhiteElo "2809"]
[LiveChessVersion "1.4.8"]
[ECO "A49"]

1. d4 {[%clk 1:59:57]} Nf6 {[%clk 1:59:55]} 2. Nf3 {[%clk 1:59:48]} g6
{[%clk 1:59:49]} 3. g3 {[%clk 1:59:45]} Bg7 {[%clk 1:59:29]} 4. Bg2
{[%clk 1:59:37]} d5 {[%clk 1:59:20]} 5. O-O {[%clk 1:59:29]} O-O {[%clk 1:59:17]}
6. Nbd2 {[%clk 1:59:25]} Nc6 {[%clk 1:52:30]} 7. b3 {[%clk 1:58:52]} e5
{[%clk 1:42:31]} 8. dxe5 {[%clk 1:58:40]} Ng4 {[%clk 1:41:54]} 9. c4
{[%clk 1:58:34]} d4 {[%clk 1:28:30]} 10. Ne4 {[%clk 1:57:56]} Ngxe5
{[%clk 1:28:16]} 11. Nxe5 {[%clk 1:57:38]} Nxe5 {[%clk 1:28:01]} 12. Bg5
{[%clk 1:57:09]} f6 {[%clk 1:23:33]} 13. Bc1 {[%clk 1:57:03]} f5 {[%clk 1:16:43]}
14. Nc5 {[%clk 1:56:00]} c6 {[%clk 1:16:19]} 15. Bb2 {[%clk 1:51:12]} Qd6
{[%clk 1:09:33]} 16. e3 {[%clk 1:48:25]} Nxc4 {[%clk 0:51:36]} 17. Bxd4
{[%clk 1:33:10]} Bxd4 {[%clk 0:51:28]} 18. Qxd4 {[%clk 1:27:44]} Qxd4
{[%clk 0:51:23]} 19. exd4 {[%clk 1:27:40]} Nd6 {[%clk 0:49:33]} 20. Rfd1
{[%clk 1:19:17]} Nb5 {[%clk 0:44:08]} 21. d5 {[%clk 1:12:15]} Nc3
{[%clk 0:43:47]} 22. dxc6 {[%clk 1:07:18]} Nxd1 {[%clk 0:43:42]} 23. Bd5+
{[%clk 1:06:22]} Kh8 {[%clk 0:43:38]} 24. cxb7 {[%clk 1:06:16]} Bxb7
{[%clk 0:43:35]} 25. Bxb7 {[%clk 1:06:09]} Rad8 {[%clk 0:42:06]} 26. Ne6
{[%clk 1:04:06]} Rfe8 {[%clk 0:39:16]} 27. Nxd8 {[%clk 1:03:24]} Rxd8
{[%clk 0:39:13]} 28. Kf1 {[%clk 0:57:56]} Nc3 {[%clk 0:37:30]} 29. a3
{[%clk 0:47:59]} Rb8 {[%clk 0:33:10]} 30. Rc1 {[%clk 0:45:55]} Nb5
{[%clk 0:33:07]} 31. Rc8+ {[%clk 0:45:40]} Rxc8 {[%clk 0:32:40]} 32. Bxc8
{[%clk 0:45:38]} Nxa3 {[%clk 0:32:27]} 33. Ke2 {[%clk 0:45:26]} Nb5
{[%clk 0:32:20]} 34. Kd3 {[%clk 0:45:13]} Kg7 {[%clk 0:32:15]} 35. Bd7
{[%clk 0:38:10]} Nd6 {[%clk 0:31:30]} 36. f3 {[%clk 0:33:17]} Kf6
{[%clk 0:31:13]} 37. Kd4 {[%clk 0:32:59]} Nf7 {[%clk 0:22:30]} 38. Bb5
{[%clk 0:25:13]} Ne5 {[%clk 0:19:25]} 39. Be2 {[%clk 0:24:07]} g5
{[%clk 0:14:51]} 40. Kd5 {[%clk 1:21:02]} h5 {[%clk 1:12:10]} 41. b4
{[%clk 1:17:12]} Ng6 {[%clk 0:56:44]} 42. b5 {[%clk 0:39:41]} f4 {[%clk 0:56:21]}
43. g4 {[%clk 0:38:00]} hxg4 {[%clk 0:56:46]} 44. fxg4 {[%clk 0:38:27]} Ne5
{[%clk 0:54:44]} 45. h3 {[%clk 0:35:14]} f3 {[%clk 0:54:14]} 46. Bf1
{[%clk 0:34:11]} f2 {[%clk 0:54:10]} 47. Ke4 {[%clk 0:33:39]} Ng6
{[%clk 0:54:09]} 48. Ke3 {[%clk 0:31:19]} Ke5 {[%clk 0:54:34]} 49. Bg2
{[%clk 0:30:02]} Nf8 {[%clk 0:53:07]} 50. Kxf2 {[%clk 0:29:34]} Kf4
{[%clk 0:53:32]} 51. Ke2 {[%clk 0:25:45]} Kg3 {[%clk 0:53:35]} 52. Bf1
{[%clk 0:22:24]} Ne6 {[%clk 0:53:58]} 53. Ke3 {[%clk 0:22:19]} Nf4
{[%clk 0:54:25]} 54. Ke4 {[%clk 0:22:12]} Nxh3 {[%clk 0:54:51]} 55. Kf5
{[%clk 0:20:20]} Nf2 {[%clk 0:55:17]} 56. Kxg5 {[%clk 0:20:04]} Nxg4
{[%clk 0:55:41]} 57. Be2 {[%clk 0:20:27]} Ne3 {[%clk 0:56:00]} 58. Kf6
{[%clk 0:20:45]} Nd5+ {[%clk 0:56:24]} 59. Ke5 {[%clk 0:21:10]} Nc3
{[%clk 0:56:49]} 60. Bc4 {[%clk 0:21:36]} Nxb5 {[%clk 0:57:16]} 61. Bxb5
{[%clk 0:22:02]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.12"]
[Round "4.3"]
[White "Caruana, Fabiano"]
[Black "Aronian, Levon"]
[Result "1/2-1/2"]
[BlackElo "2785"]
[WhiteElo "2823"]
[LiveChessVersion "1.4.8"]
[ECO "C77"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:52]} Nc6
{[%clk 1:59:51]} 3. Bb5 {[%clk 1:59:47]} a6 {[%clk 1:59:46]} 4. Ba4
{[%clk 1:59:44]} Nf6 {[%clk 1:59:40]} 5. d3 {[%clk 1:59:38]} b5 {[%clk 1:59:06]}
6. Bb3 {[%clk 1:59:32]} Be7 {[%clk 1:59:02]} 7. a4 {[%clk 1:56:13]} b4
{[%clk 1:58:18]} 8. Nbd2 {[%clk 1:54:44]} Bc5 {[%clk 1:58:10]} 9. Nf1
{[%clk 1:49:32]} d6 {[%clk 1:57:02]} 10. Ng3 {[%clk 1:48:20]} Nd4
{[%clk 1:45:36]} 11. Nxd4 {[%clk 1:45:39]} Bxd4 {[%clk 1:45:32]} 12. O-O
{[%clk 1:37:40]} O-O {[%clk 1:39:52]} 13. Rb1 {[%clk 1:18:44]} Rb8
{[%clk 1:34:00]} 14. c3 {[%clk 1:10:44]} Ba7 {[%clk 1:33:53]} 15. d4
{[%clk 1:04:28]} Be6 {[%clk 1:26:55]} 16. Bxe6 {[%clk 0:49:37]} fxe6
{[%clk 1:26:49]} 17. Be3 {[%clk 0:49:20]} bxc3 {[%clk 1:26:19]} 18. bxc3
{[%clk 0:38:31]} Rxb1 {[%clk 1:26:07]} 19. Qxb1 {[%clk 0:38:27]} Ng4
{[%clk 1:25:45]} 20. h3 {[%clk 0:32:42]} Nxe3 {[%clk 1:23:51]} 21. fxe3
{[%clk 0:32:30]} Qg5 {[%clk 1:22:30]} 22. Kh2 {[%clk 0:28:42]} a5
{[%clk 1:08:21]} 23. Rxf8+ {[%clk 0:20:17]} Kxf8 {[%clk 1:08:12]} 24. Qb7
{[%clk 0:13:31]} Bb6 {[%clk 1:07:58]} 25. Qc8+ {[%clk 0:13:20]} Kf7
{[%clk 1:07:14]} 26. Qd7+ {[%clk 0:12:20]} Qe7 {[%clk 1:07:07]} 27. Qb5
{[%clk 0:11:47]} g6 {[%clk 1:04:18]} 28. Nf1 {[%clk 0:09:33]} Qg5
{[%clk 1:02:34]} 29. Nd2 {[%clk 0:08:18]} Qxe3 {[%clk 1:01:04]} 30. Qd7+
{[%clk 0:08:13]} Kf8 {[%clk 1:00:46]} 31. Qd8+ {[%clk 0:08:09]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.12"]
[Round "4.4"]
[White "Anand, Viswanathan"]
[Black "Adams, Michael"]
[Result "1/2-1/2"]
[BlackElo "2748"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "C54"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:51]} Nc6
{[%clk 1:59:52]} 3. Bc4 {[%clk 1:59:44]} Bc5 {[%clk 1:59:45]} 4. c3
{[%clk 1:59:33]} Nf6 {[%clk 1:59:39]} 5. d3 {[%clk 1:59:27]} d6 {[%clk 1:59:14]}
6. O-O {[%clk 1:59:11]} h6 {[%clk 1:59:05]} 7. Re1 {[%clk 1:58:49]} O-O
{[%clk 1:58:54]} 8. Nbd2 {[%clk 1:58:33]} Ne7 {[%clk 1:50:13]} 9. Bb3
{[%clk 1:46:10]} Ng6 {[%clk 1:47:21]} 10. d4 {[%clk 1:41:07]} Bb6
{[%clk 1:45:59]} 11. Nc4 {[%clk 1:40:44]} Be6 {[%clk 1:39:58]} 12. h3
{[%clk 1:31:18]} c6 {[%clk 1:30:40]} 13. dxe5 {[%clk 1:26:04]} dxe5
{[%clk 1:18:52]} 14. Ncxe5 {[%clk 1:16:09]} Nxe5 {[%clk 1:12:40]} 15. Nxe5
{[%clk 1:15:56]} Re8 {[%clk 1:12:29]} 16. Qxd8 {[%clk 1:12:29]} Raxd8
{[%clk 1:12:23]} 17. Bc2 {[%clk 1:11:53]} g5 {[%clk 1:02:09]} 18. Nf3
{[%clk 1:04:46]} g4 {[%clk 0:49:29]} 19. Nd4 {[%clk 0:57:02]} gxh3
{[%clk 0:47:57]} 20. gxh3 {[%clk 0:54:51]} Bxh3 {[%clk 0:41:13]} 21. Re3
{[%clk 0:47:12]} Bg4 {[%clk 0:38:52]} 22. Rg3 {[%clk 0:39:22]} Bc7
{[%clk 0:37:42]} 23. f4 {[%clk 0:32:47]} h5 {[%clk 0:30:58]} 24. e5
{[%clk 0:32:29]} Nd5 {[%clk 0:29:20]} 25. Bf5 {[%clk 0:29:31]} Bb6
{[%clk 0:23:29]} 26. Bxg4 {[%clk 0:27:13]} hxg4 {[%clk 0:23:23]} 27. Rxg4+
{[%clk 0:27:07]} Kf8 {[%clk 0:23:04]} 28. Bd2 {[%clk 0:25:03]} Ke7
{[%clk 0:16:05]} 29. Kf2 {[%clk 0:20:48]} Nxc3 {[%clk 0:13:43]} 30. bxc3
{[%clk 0:20:33]} Rxd4 {[%clk 0:13:39]} 31. cxd4 {[%clk 0:20:20]} Bxd4+
{[%clk 0:13:35]} 32. Be3 {[%clk 0:19:15]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.12"]
[Round "4.5"]
[White "Topalov, Veselin"]
[Black "Nakamura, Hikaru"]
[Result "0-1"]
[BlackElo "2779"]
[WhiteElo "2760"]
[LiveChessVersion "1.4.8"]
[ECO "B12"]

1. e4 {[%clk 1:59:56]} c6 {[%clk 1:59:54]} 2. d4 {[%clk 1:59:47]} d5
{[%clk 1:59:45]} 3. e5 {[%clk 1:59:40]} c5 {[%clk 1:59:41]} 4. dxc5
{[%clk 1:59:32]} Nc6 {[%clk 1:59:28]} 5. Nf3 {[%clk 1:57:21]} Bg4
{[%clk 1:58:55]} 6. c3 {[%clk 1:56:29]} e6 {[%clk 1:58:14]} 7. b4
{[%clk 1:50:26]} a6 {[%clk 1:52:51]} 8. Nbd2 {[%clk 1:44:09]} Nxe5
{[%clk 1:49:59]} 9. Qa4+ {[%clk 1:37:50]} Nd7 {[%clk 1:44:17]} 10. Ne5
{[%clk 1:34:22]} Ngf6 {[%clk 1:42:43]} 11. c4 {[%clk 1:20:02]} a5
{[%clk 1:30:15]} 12. Nb3 {[%clk 1:16:58]} axb4 {[%clk 1:29:13]} 13. Qb5
{[%clk 1:16:41]} Be7 {[%clk 1:27:25]} 14. c6 {[%clk 1:05:52]} bxc6
{[%clk 1:23:46]} 15. Nxc6 {[%clk 1:05:36]} Qc7 {[%clk 1:23:00]} 16. f3
{[%clk 0:59:29]} Bf5 {[%clk 1:20:18]} 17. Nxe7 {[%clk 0:49:17]} Rb8
{[%clk 1:06:28]} 18. Nxf5 {[%clk 0:48:22]} Rxb5 {[%clk 1:05:51]} 19. Nxg7+
{[%clk 0:48:13]} Ke7 {[%clk 0:52:55]} 20. cxb5 {[%clk 0:47:55]} Nc5
{[%clk 0:52:53]} 21. Bb2 {[%clk 0:40:31]} Nxb3 {[%clk 0:42:58]} 22. axb3
{[%clk 0:40:24]} Qf4 {[%clk 0:42:55]} 23. Be2 {[%clk 0:26:32]} Rc8
{[%clk 0:42:10]} 24. Rd1 {[%clk 0:21:11]} Qg5 {[%clk 0:38:17]} 25. b6
{[%clk 0:17:27]} Rc2 {[%clk 0:19:35]} 26. Bxf6+ {[%clk 0:11:41]} Qxf6
{[%clk 0:19:29]} 27. Nh5 {[%clk 0:10:24]} Qc3+ {[%clk 0:18:17]} 28. Kf1
{[%clk 0:10:19]} Qe3 {[%clk 0:14:07]} 29. Re1 {[%clk 0:09:58]} Qxb6
{[%clk 0:14:02]} 30. Nf4 {[%clk 0:09:27]} Qe3 {[%clk 0:12:50]} 31. g3
{[%clk 0:08:48]} Qxb3 {[%clk 0:12:38]} 32. Kg2 {[%clk 0:04:52]} Kf8
{[%clk 0:06:59]} 33. Kh3 {[%clk 0:04:44]} Qb2 {[%clk 0:05:19]} 34. Rb1
{[%clk 0:03:01]} Qf6 {[%clk 0:04:50]} 35. Rhe1 {[%clk 0:02:42]} e5
{[%clk 0:03:56]} 36. Nxd5 {[%clk 0:01:00]} Qe6+ {[%clk 0:03:43]} 37. Kg2
{[%clk 0:00:52]} Qxd5 {[%clk 0:03:01]} 38. Rxb4 {[%clk 0:00:45]} Qd2
{[%clk 0:02:33]} 39. Rb8+ {[%clk 0:00:42]} Kg7 {[%clk 0:02:29]} 40. Kf1
{[%clk 1:00:39]} Qh6 {[%clk 1:01:45]} 41. Kg2 {[%clk 0:58:08]} e4
{[%clk 0:57:15]} 42. Rb3 {[%clk 0:52:44]} Qe6 {[%clk 0:51:27]} 43. Re3
{[%clk 0:51:38]} exf3+ {[%clk 0:51:15]} 44. Kxf3 {[%clk 0:51:27]} Qh3
{[%clk 0:51:38]} 45. Rd1 {[%clk 0:40:54]} Qh5+ {[%clk 0:51:16]} 46. Kf2
{[%clk 0:39:46]} Qxh2+ {[%clk 0:51:41]} 47. Kf3 {[%clk 0:40:04]} Rc6
{[%clk 0:50:29]} 48. Rd4 {[%clk 0:37:55]} Rg6 {[%clk 0:50:46]} 49. g4
{[%clk 0:36:25]} Rf6+ {[%clk 0:50:28]} 50. Ke4 {[%clk 0:36:37]} Qh1+
{[%clk 0:47:31]} 51. Kd3 {[%clk 0:36:57]} Qb1+ {[%clk 0:47:41]} 52. Kd2
{[%clk 0:37:02]} Qb2+ {[%clk 0:47:14]} 53. Kd3 {[%clk 0:37:27]} Rc6
{[%clk 0:47:02]} 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.11"]
[Round "3.1"]
[White "Aronian, Levon"]
[Black "So, Wesley"]
[Result "1/2-1/2"]
[BlackElo "2794"]
[WhiteElo "2785"]
[LiveChessVersion "1.4.8"]
[ECO "A34"]

1. c4 {[%clk 1:59:56]} c5 {[%clk 1:59:44]} 2. Nf3 {[%clk 1:59:49]} Nf6
{[%clk 1:59:39]} 3. Nc3 {[%clk 1:59:19]} d5 {[%clk 1:59:34]} 4. cxd5
{[%clk 1:58:26]} Nxd5 {[%clk 1:59:28]} 5. e4 {[%clk 1:57:57]} Nb4
{[%clk 1:59:23]} 6. Bc4 {[%clk 1:57:29]} Nd3+ {[%clk 1:59:11]} 7. Ke2
{[%clk 1:57:24]} Nf4+ {[%clk 1:59:06]} 8. Kf1 {[%clk 1:57:20]} Nd3
{[%clk 1:59:02]} 9. Qe2 {[%clk 1:56:45]} Nxc1 {[%clk 1:58:55]} 10. Rxc1
{[%clk 1:56:41]} e6 {[%clk 1:58:52]} 11. h4 {[%clk 1:54:12]} a6 {[%clk 1:58:43]}
12. e5 {[%clk 1:51:46]} Nc6 {[%clk 1:57:42]} 13. Rh3 {[%clk 1:50:41]} b5
{[%clk 1:56:34]} 14. Bd3 {[%clk 1:49:26]} Bb7 {[%clk 1:55:57]} 15. Be4
{[%clk 1:41:12]} Qd7 {[%clk 1:55:15]} 16. Rg3 {[%clk 1:29:35]} g6
{[%clk 1:54:07]} 17. Kg1 {[%clk 1:21:15]} Be7 {[%clk 1:42:30]} 18. Qe3
{[%clk 1:11:06]} O-O-O {[%clk 1:39:46]} 19. Rg4 {[%clk 1:01:04]} Kb8
{[%clk 1:37:54]} 20. Rf4 {[%clk 0:59:27]} Rhf8 {[%clk 1:36:41]} 21. a4
{[%clk 0:53:38]} b4 {[%clk 1:27:09]} 22. Bxc6 {[%clk 0:45:51]} Bxc6
{[%clk 0:33:27]} 23. Ne4 {[%clk 0:45:14]} Bxe4 {[%clk 0:29:46]} 24. Rxe4
{[%clk 0:43:46]} a5 {[%clk 0:29:36]} 25. Rec4 {[%clk 0:35:25]} Qxa4
{[%clk 0:25:20]} 26. d4 {[%clk 0:35:11]} Rd5 {[%clk 0:23:07]} 27. dxc5
{[%clk 0:34:51]} Qc6 {[%clk 0:20:44]} 28. Nd4 {[%clk 0:20:27]} Qc7
{[%clk 0:20:38]} 29. Qf3 {[%clk 0:19:48]} Rfd8 {[%clk 0:16:51]} 30. Nb5
{[%clk 0:14:03]} Qxe5 {[%clk 0:16:46]} 31. c6 {[%clk 0:13:46]} Rc8
{[%clk 0:16:34]} 32. Qxf7 {[%clk 0:04:00]} Qf6 {[%clk 0:13:55]} 33. Rf4
{[%clk 0:03:59]} Qxf7 {[%clk 0:10:58]} 34. Rxf7 {[%clk 0:03:56]} Rxb5
{[%clk 0:10:45]} 35. Rxe7 {[%clk 0:03:54]} Rc7 {[%clk 0:10:37]} 36. Rxe6
{[%clk 0:03:48]} Ka7 {[%clk 0:10:35]} 37. Kf1 {[%clk 0:01:34]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.11"]
[Round "3.2"]
[White "Caruana, Fabiano"]
[Black "Kramnik, Vladimir"]
[Result "1/2-1/2"]
[BlackElo "2809"]
[WhiteElo "2823"]
[LiveChessVersion "1.4.8"]
[ECO "C54"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:54]} 2. Nf3 {[%clk 1:59:53]} Nc6
{[%clk 1:59:48]} 3. Bc4 {[%clk 1:59:49]} Bc5 {[%clk 1:59:40]} 4. c3
{[%clk 1:59:43]} Nf6 {[%clk 1:59:31]} 5. d3 {[%clk 1:59:38]} O-O {[%clk 1:59:17]}
6. a4 {[%clk 1:59:09]} d5 {[%clk 1:57:52]} 7. exd5 {[%clk 1:59:00]} Nxd5
{[%clk 1:57:47]} 8. a5 {[%clk 1:58:42]} a6 {[%clk 1:53:15]} 9. O-O
{[%clk 1:58:19]} b5 {[%clk 1:41:13]} 10. axb6 {[%clk 1:57:59]} Nxb6
{[%clk 1:40:40]} 11. Bb3 {[%clk 1:57:42]} Bf5 {[%clk 1:35:15]} 12. Bc2
{[%clk 1:49:43]} Qd7 {[%clk 1:22:04]} 13. Qe2 {[%clk 1:44:33]} Rfd8
{[%clk 1:12:39]} 14. Nxe5 {[%clk 1:21:22]} Qe6 {[%clk 1:10:27]} 15. d4
{[%clk 1:16:35]} Bxc2 {[%clk 1:10:15]} 16. Qxc2 {[%clk 1:16:27]} Bxd4
{[%clk 1:06:00]} 17. Nf3 {[%clk 1:06:13]} Be5 {[%clk 1:04:51]} 18. Bg5
{[%clk 0:54:34]} f6 {[%clk 1:03:01]} 19. Be3 {[%clk 0:48:49]} Nc4
{[%clk 1:00:42]} 20. Re1 {[%clk 0:47:54]} Rab8 {[%clk 0:56:04]} 21. Bc1
{[%clk 0:47:13]} a5 {[%clk 0:48:44]} 22. Ra4 {[%clk 0:43:38]} Qd5
{[%clk 0:42:44]} 23. Nbd2 {[%clk 0:38:39]} Nb6 {[%clk 0:41:10]} 24. Rae4
{[%clk 0:27:11]} a4 {[%clk 0:37:01]} 25. Rh4 {[%clk 0:15:58]} Qd3
{[%clk 0:36:07]} 26. Qxd3 {[%clk 0:15:51]} Rxd3 {[%clk 0:36:02]} 27. Nc4
{[%clk 0:15:16]} Nxc4 {[%clk 0:27:19]} 28. Rxc4 {[%clk 0:14:42]} a3
{[%clk 0:27:12]} 29. Rxc6 {[%clk 0:12:13]} axb2 {[%clk 0:26:53]} 30. Bxb2
{[%clk 0:12:08]} Rxb2 {[%clk 0:26:49]} 31. Nxe5 {[%clk 0:11:48]} fxe5
{[%clk 0:26:43]} 32. Rxc7 {[%clk 0:11:30]} Rdd2 {[%clk 0:24:40]} 33. Rc8+
{[%clk 0:09:53]} Kf7 {[%clk 0:24:34]} 34. Rc7+ {[%clk 0:09:50]} Kf6
{[%clk 0:24:02]} 35. Rf1 {[%clk 0:08:16]} h6 {[%clk 0:21:14]} 36. h4
{[%clk 0:06:34]} e4 {[%clk 0:11:53]} 37. h5 {[%clk 0:05:32]} Rb5 {[%clk 0:09:27]}
38. Ra1 {[%clk 0:03:40]} Rd6 {[%clk 0:09:25]} 39. Kf1 {[%clk 0:01:36]} Rxh5
{[%clk 0:07:37]} 40. Raa7 {[%clk 1:01:28]} Rh1+ {[%clk 1:05:52]} 41. Ke2
{[%clk 1:01:53]} g5 {[%clk 1:03:29]} 42. Rf7+ {[%clk 0:56:32]} Kg6
{[%clk 1:03:24]} 43. g4 {[%clk 0:56:13]} Rdd1 {[%clk 1:03:22]} 44. Rg7+
{[%clk 0:56:36]} Kf6 {[%clk 1:03:49]} 45. Rgf7+ {[%clk 0:56:58]} Kg6
{[%clk 1:04:14]} 46. Rg7+ {[%clk 0:57:25]} Kf6 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.11"]
[Round "3.3"]
[White "Nakamura, Hikaru"]
[Black "Anand, Viswanathan"]
[Result "1-0"]
[BlackElo "2779"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:54]} Nf6 {[%clk 1:59:50]} 2. c4 {[%clk 1:59:40]} e6
{[%clk 1:59:43]} 3. Nf3 {[%clk 1:59:21]} d5 {[%clk 1:59:34]} 4. Nc3
{[%clk 1:59:14]} Nbd7 {[%clk 1:59:25]} 5. cxd5 {[%clk 1:58:47]} exd5
{[%clk 1:59:15]} 6. Bg5 {[%clk 1:58:41]} Bb4 {[%clk 1:58:59]} 7. e3
{[%clk 1:58:08]} h6 {[%clk 1:58:45]} 8. Bh4 {[%clk 1:57:59]} g5 {[%clk 1:58:38]}
9. Bg3 {[%clk 1:57:53]} Ne4 {[%clk 1:58:31]} 10. Nd2 {[%clk 1:57:47]} Nxg3
{[%clk 1:58:07]} 11. hxg3 {[%clk 1:57:22]} c6 {[%clk 1:57:59]} 12. a3
{[%clk 1:57:15]} Ba5 {[%clk 1:57:30]} 13. Bd3 {[%clk 1:57:04]} Kf8
{[%clk 1:56:59]} 14. Qc2 {[%clk 1:56:56]} Nf6 {[%clk 1:56:01]} 15. O-O-O
{[%clk 1:56:42]} Kg7 {[%clk 1:54:44]} 16. Kb1 {[%clk 1:56:32]} Be6
{[%clk 1:47:50]} 17. Nb3 {[%clk 1:52:30]} Bb6 {[%clk 1:40:35]} 18. f4
{[%clk 1:38:48]} Bg4 {[%clk 1:31:29]} 19. Rde1 {[%clk 1:17:24]} Qd6
{[%clk 1:17:36]} 20. Rhf1 {[%clk 0:55:04]} Rae8 {[%clk 1:10:56]} 21. Nc5
{[%clk 0:36:04]} Re7 {[%clk 1:01:10]} 22. Qd2 {[%clk 0:34:09]} Rhe8
{[%clk 0:39:23]} 23. fxg5 {[%clk 0:32:26]} hxg5 {[%clk 0:39:16]} 24. e4
{[%clk 0:30:22]} Nxe4 {[%clk 0:39:00]} 25. N5xe4 {[%clk 0:26:42]} dxe4
{[%clk 0:38:47]} 26. Rxe4 {[%clk 0:26:38]} Rxe4 {[%clk 0:27:37]} 27. Nxe4
{[%clk 0:26:33]} Qg6 {[%clk 0:22:46]} 28. Nf6 {[%clk 0:19:55]} Qxf6
{[%clk 0:22:39]} 29. Rxf6 {[%clk 0:19:51]} Kxf6 {[%clk 0:22:32]} 30. Qc3
{[%clk 0:19:10]} Bd7 {[%clk 0:13:48]} 31. d5+ {[%clk 0:18:31]} Re5
{[%clk 0:13:40]} 32. Be4 {[%clk 0:18:16]} g4 {[%clk 0:08:32]} 33. dxc6
{[%clk 0:15:02]} bxc6 {[%clk 0:08:18]} 34. Bxc6 {[%clk 0:14:26]} Bxc6
{[%clk 0:06:45]} 35. Qxc6+ {[%clk 0:14:19]} Kg5 {[%clk 0:06:34]} 36. Qd7
{[%clk 0:06:43]} Re3 {[%clk 0:04:53]} 37. Qxf7 {[%clk 0:03:32]} Rxg3
{[%clk 0:04:48]} 38. Qd5+ {[%clk 0:02:50]} Kh4 {[%clk 0:04:32]} 39. a4
{[%clk 0:02:43]} Bf2 {[%clk 0:03:34]} 40. Qd8+ {[%clk 1:02:37]} Kh5
{[%clk 1:03:56]} 41. Qe8+ {[%clk 1:00:48]} Kg5 {[%clk 1:04:18]} 42. Qe5+
{[%clk 1:01:11]} Kg6 {[%clk 1:04:41]} 43. Qf4 {[%clk 1:01:34]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.11"]
[Round "3.4"]
[White "Vachier-Lagrave, Maxime"]
[Black "Topalov, Veselin"]
[Result "1/2-1/2"]
[BlackElo "2760"]
[WhiteElo "2804"]
[LiveChessVersion "1.4.8"]
[ECO "C67"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:54]} 2. Nf3 {[%clk 1:59:54]} Nc6
{[%clk 1:59:49]} 3. Bb5 {[%clk 1:59:52]} Nf6 {[%clk 1:59:31]} 4. O-O
{[%clk 1:57:57]} Nxe4 {[%clk 1:58:28]} 5. Re1 {[%clk 1:57:07]} Nd6
{[%clk 1:58:14]} 6. Nxe5 {[%clk 1:57:04]} Be7 {[%clk 1:58:02]} 7. Bf1
{[%clk 1:57:00]} Nf5 {[%clk 1:54:22]} 8. Nf3 {[%clk 1:56:16]} O-O
{[%clk 1:54:13]} 9. d4 {[%clk 1:55:57]} d5 {[%clk 1:54:09]} 10. g3
{[%clk 1:55:21]} Re8 {[%clk 1:51:16]} 11. Nc3 {[%clk 1:52:41]} Be6
{[%clk 1:51:08]} 12. Ne2 {[%clk 1:49:01]} g5 {[%clk 1:51:00]} 13. h3
{[%clk 1:37:58]} h6 {[%clk 1:42:13]} 14. Bg2 {[%clk 1:22:13]} Ng7
{[%clk 1:32:39]} 15. Ne5 {[%clk 1:17:42]} f6 {[%clk 1:16:40]} 16. Nxc6
{[%clk 1:12:25]} bxc6 {[%clk 1:16:34]} 17. c4 {[%clk 1:12:17]} Qd7
{[%clk 1:13:14]} 18. Kh2 {[%clk 1:12:07]} Bb4 {[%clk 1:01:43]} 19. Bd2
{[%clk 1:00:14]} Bxd2 {[%clk 1:00:34]} 20. Qxd2 {[%clk 1:00:09]} dxc4
{[%clk 1:00:29]} 21. Nc3 {[%clk 0:58:23]} Bd5 {[%clk 0:59:44]} 22. Ne4
{[%clk 0:55:57]} Qf7 {[%clk 0:57:31]} 23. Qa5 {[%clk 0:53:58]} f5
{[%clk 0:42:52]} 24. Nc3 {[%clk 0:53:51]} Bxg2 {[%clk 0:42:45]} 25. Kxg2
{[%clk 0:53:45]} f4 {[%clk 0:42:39]} 26. Qc5 {[%clk 0:38:31]} fxg3
{[%clk 0:40:16]} 27. fxg3 {[%clk 0:38:26]} Rxe1 {[%clk 0:34:35]} 28. Rxe1
{[%clk 0:38:16]} Rf8 {[%clk 0:34:24]} 29. d5 Nh5 30. Rg1 {[%clk 0:18:29]} cxd5
{[%clk 0:13:49]} 31. Qxd5 {[%clk 0:15:28]} Qxd5+ {[%clk 0:11:42]} 32. Nxd5
{[%clk 0:15:19]} Rd8 {[%clk 0:10:05]} 33. Rd1 {[%clk 0:13:36]} Kg7
{[%clk 0:09:43]} 34. Kf3 c6 {[%clk 0:07:42]} 35. Ne3 {[%clk 0:10:38]} Rd3
{[%clk 0:07:30]} 36. Rxd3 {[%clk 0:10:19]} cxd3 {[%clk 0:07:24]} 37. Nf1
{[%clk 0:10:15]} Kf6 {[%clk 0:05:59]} 38. Ke3 {[%clk 0:09:59]} Ke5
{[%clk 0:05:39]} 39. Kxd3 {[%clk 0:09:53]} Nf6 {[%clk 0:05:10]} 40. Ne3
{[%clk 1:09:37]} h5 {[%clk 1:04:48]} 41. Nc4+ {[%clk 1:08:26]} Kd5
{[%clk 1:04:54]} 42. Ne3+ {[%clk 1:08:53]} Ke5 {[%clk 1:05:18]} 43. Nc4+
{[%clk 1:09:20]} Kd5 {[%clk 1:05:42]} 44. Ne3+ {[%clk 1:09:46]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.11"]
[Round "3.5"]
[White "Adams, Michael"]
[Black "Giri, Anish"]
[Result "1/2-1/2"]
[BlackElo "2771"]
[WhiteElo "2748"]
[LiveChessVersion "1.4.8"]
[ECO "B51"]

1. e4 {[%clk 1:59:56]} c5 {[%clk 1:59:58]} 2. Nf3 {[%clk 1:59:51]} d6
{[%clk 1:59:54]} 3. Bb5+ {[%clk 1:59:47]} Nd7 {[%clk 1:59:50]} 4. d4
{[%clk 1:59:41]} cxd4 {[%clk 1:59:35]} 5. Qxd4 {[%clk 1:59:34]} a6
{[%clk 1:59:22]} 6. Bxd7+ {[%clk 1:59:27]} Bxd7 {[%clk 1:59:01]} 7. Nc3
{[%clk 1:59:20]} e5 {[%clk 1:57:45]} 8. Qd3 {[%clk 1:59:12]} Rc8 {[%clk 1:55:17]}
9. O-O {[%clk 1:58:53]} h6 {[%clk 1:45:27]} 10. Nd2 {[%clk 1:57:50]} Qc7
{[%clk 1:45:07]} 11. Rd1 {[%clk 1:56:56]} Bg4 {[%clk 1:44:51]} 12. f3
{[%clk 1:54:50]} Be6 {[%clk 1:44:47]} 13. Nf1 {[%clk 1:52:10]} Nf6
{[%clk 1:43:21]} 14. Ne3 {[%clk 1:49:43]} Be7 {[%clk 1:43:12]} 15. a4
{[%clk 1:48:15]} O-O {[%clk 1:43:04]} 16. Bd2 {[%clk 1:47:55]} Rfd8
{[%clk 1:42:57]} 17. Be1 {[%clk 1:25:30]} d5 {[%clk 1:40:31]} 18. Nexd5
{[%clk 1:08:51]} Bxd5 {[%clk 1:35:24]} 19. exd5 {[%clk 1:08:25]} Bb4
{[%clk 1:28:39]} 20. Kh1 {[%clk 1:03:43]} Bxc3 {[%clk 1:14:11]} 21. Qxc3
{[%clk 0:53:06]} Qxc3 {[%clk 1:09:02]} 22. Bxc3 {[%clk 0:51:56]} Nxd5
{[%clk 1:05:52]} 23. Bxe5 {[%clk 0:48:20]} Ne3 {[%clk 1:04:16]} 24. Rxd8+
{[%clk 0:43:53]} Rxd8 {[%clk 1:04:14]} 25. Rc1 {[%clk 0:33:03]} f6
{[%clk 0:54:28]} 26. Bc3 {[%clk 0:25:12]} Nxc2 {[%clk 0:51:32]} 27. Kg1
{[%clk 0:23:27]} Nd4 {[%clk 0:41:55]} 28. Kf2 {[%clk 0:20:31]} Nb3
{[%clk 0:39:26]} 29. Re1 {[%clk 0:17:12]} Nc5 {[%clk 0:33:35]} 30. Re7
{[%clk 0:16:57]} b6 {[%clk 0:30:43]} 31. a5 {[%clk 0:14:56]} bxa5
{[%clk 0:30:36]} 32. Bxa5 {[%clk 0:12:17]} Rb8 {[%clk 0:30:28]} 33. Bc3
{[%clk 0:08:19]} Nd3+ {[%clk 0:30:03]} 34. Ke2 {[%clk 0:06:56]} Nxb2
{[%clk 0:29:44]} 35. Re4 {[%clk 0:05:26]} Rc8 {[%clk 0:29:18]} 36. Bxb2
{[%clk 0:04:02]} Rc2+ {[%clk 0:29:09]} 37. Ke3 {[%clk 0:03:47]} Rxb2
{[%clk 0:28:57]} 38. g4 {[%clk 0:03:43]} Rb3+ {[%clk 0:22:26]} 39. Kf4
{[%clk 0:02:57]} Kf7 {[%clk 0:16:54]} 40. Ra4 {[%clk 1:03:01]} Rb6
{[%clk 1:17:21]} 41. h4 {[%clk 1:02:00]} g6 {[%clk 1:08:16]} 42. h5
{[%clk 0:52:59]} g5+ {[%clk 1:07:54]} 43. Ke4 {[%clk 0:48:33]} Re6+
{[%clk 1:07:43]} 44. Kd4 {[%clk 0:47:30]} Ke7 {[%clk 1:06:01]} 45. Ra5
{[%clk 0:43:25]} Kd7 {[%clk 1:05:15]} 46. Kc4 {[%clk 0:37:23]} Kc7
{[%clk 1:01:57]} 47. Kb4 {[%clk 0:36:11]} Rc6 {[%clk 0:56:57]} 48. Rf5
{[%clk 0:31:11]} Re6 {[%clk 0:46:35]} 49. Kc4 {[%clk 0:30:34]} Kb7
{[%clk 0:43:50]} 50. Kb4 {[%clk 0:29:58]} Kb6 {[%clk 0:43:54]} 51. Rd5
{[%clk 0:29:14]} Rc6 {[%clk 0:43:32]} 52. Rf5 {[%clk 0:28:01]} Rd6
{[%clk 0:37:55]} 53. Kc4 {[%clk 0:28:04]} a5 {[%clk 0:33:16]} 54. Kb3
{[%clk 0:28:18]} Ka6 {[%clk 0:27:36]} 55. Kb2 {[%clk 0:23:53]} Rb6+
{[%clk 0:26:40]} 56. Ka3 {[%clk 0:24:13]} Rc6 {[%clk 0:19:19]} 57. Kb2
{[%clk 0:24:08]} Kb6 {[%clk 0:18:48]} 58. Kb3 {[%clk 0:24:25]} Rd6
{[%clk 0:19:14]} 59. Kb2 {[%clk 0:22:22]} Ka6 {[%clk 0:15:07]} 60. Kb3
{[%clk 0:22:21]} Rb6+ {[%clk 0:15:32]} 61. Ka3 {[%clk 0:22:39]} Kb7
{[%clk 0:13:30]} 62. Ka4 {[%clk 0:22:23]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.09"]
[Round "1.1"]
[White "Nakamura, Hikaru"]
[Black "So, Wesley"]
[Result "0-1"]
[BlackElo "2794"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "D85"]

1. d4 {[%clk 1:59:54]} Nf6 {[%clk 1:59:53]} 2. c4 {[%clk 1:59:45]} g6
{[%clk 1:59:49]} 3. Nc3 {[%clk 1:59:26]} d5 {[%clk 1:59:44]} 4. cxd5
{[%clk 1:59:22]} Nxd5 {[%clk 1:59:40]} 5. e4 {[%clk 1:58:56]} Nxc3
{[%clk 1:59:35]} 6. bxc3 {[%clk 1:58:52]} Bg7 {[%clk 1:59:31]} 7. Be3
{[%clk 1:58:41]} c5 {[%clk 1:59:24]} 8. Rc1 {[%clk 1:58:35]} O-O {[%clk 1:58:51]}
9. Qd2 {[%clk 1:58:30]} e5 {[%clk 1:58:06]} 10. d5 {[%clk 1:58:16]} Nd7
{[%clk 1:55:52]} 11. c4 {[%clk 1:52:16]} f5 {[%clk 1:54:07]} 12. Bg5
{[%clk 1:52:08]} Nf6 {[%clk 1:50:49]} 13. Ne2 {[%clk 1:51:43]} Nxe4
{[%clk 1:35:23]} 14. Bxd8 {[%clk 1:51:19]} Nxd2 {[%clk 1:35:18]} 15. Be7
{[%clk 1:41:04]} Rf7 {[%clk 1:34:52]} 16. Bxc5 {[%clk 1:21:31]} Nxf1
{[%clk 1:34:34]} 17. Rxf1 {[%clk 0:56:25]} b6 {[%clk 1:34:19]} 18. Bb4
{[%clk 0:52:53]} Ba6 {[%clk 1:33:57]} 19. f4 {[%clk 0:52:22]} Rc8
{[%clk 1:29:11]} 20. fxe5 {[%clk 0:50:36]} Bxe5 {[%clk 1:24:33]} 21. Rf3
{[%clk 0:50:30]} Bxc4 {[%clk 1:17:11]} 22. Re3 {[%clk 0:48:03]} Bg7
{[%clk 1:15:08]} 23. Nf4 {[%clk 0:46:01]} Rd7 {[%clk 1:04:51]} 24. a4
{[%clk 0:34:40]} Bh6 {[%clk 0:43:04]} 25. g3 {[%clk 0:34:20]} Bxf4
{[%clk 0:38:14]} 26. gxf4 {[%clk 0:34:14]} Rxd5 {[%clk 0:38:10]} 27. Re7
{[%clk 0:27:46]} Rd4 {[%clk 0:36:06]} 28. Bd2 {[%clk 0:27:39]} Kf8
{[%clk 0:31:12]} 29. Bb4 {[%clk 0:27:31]} Re8 {[%clk 0:30:06]} 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.09"]
[Round "1.2"]
[White "Caruana, Fabiano"]
[Black "Anand, Viswanathan"]
[Result "1/2-1/2"]
[BlackElo "2779"]
[WhiteElo "2823"]
[LiveChessVersion "1.4.8"]
[ECO "A21"]

1. c4 {[%clk 1:59:57]} e5 {[%clk 1:59:49]} 2. Nc3 {[%clk 1:59:51]} Bb4
{[%clk 1:59:39]} 3. Nd5 {[%clk 1:59:45]} Bc5 {[%clk 1:59:28]} 4. Nf3
{[%clk 1:59:37]} c6 {[%clk 1:59:14]} 5. Nc3 {[%clk 1:59:32]} d6 {[%clk 1:59:04]}
6. g3 {[%clk 1:59:25]} Nf6 {[%clk 1:55:15]} 7. Bg2 {[%clk 1:59:08]} O-O
{[%clk 1:53:21]} 8. O-O {[%clk 1:58:54]} Re8 {[%clk 1:42:54]} 9. d3
{[%clk 1:58:40]} h6 {[%clk 1:42:04]} 10. Na4 {[%clk 1:57:22]} Bb4
{[%clk 1:39:28]} 11. a3 {[%clk 1:57:15]} Ba5 {[%clk 1:39:22]} 12. b4
{[%clk 1:57:08]} Bc7 {[%clk 1:39:16]} 13. e4 {[%clk 1:54:41]} Bg4
{[%clk 1:33:10]} 14. h3 {[%clk 1:45:33]} Bxf3 {[%clk 1:32:14]} 15. Qxf3
{[%clk 1:45:11]} Nbd7 {[%clk 1:31:04]} 16. Qd1 {[%clk 1:26:09]} a6
{[%clk 1:25:10]} 17. Nc3 {[%clk 1:08:27]} Bb6 {[%clk 1:17:00]} 18. Ne2
{[%clk 1:07:15]} a5 {[%clk 1:11:08]} 19. Bb2 {[%clk 1:02:02]} Qe7
{[%clk 1:02:04]} 20. Kh2 {[%clk 0:47:50]} axb4 {[%clk 0:57:39]} 21. axb4
{[%clk 0:47:44]} Rxa1 {[%clk 0:56:47]} 22. Qxa1 {[%clk 0:43:53]} h5
{[%clk 0:52:07]} 23. Kh1 {[%clk 0:31:24]} h4 {[%clk 0:45:43]} 24. g4
{[%clk 0:24:19]} Nh7 {[%clk 0:40:17]} 25. f4 {[%clk 0:20:29]} Be3
{[%clk 0:37:59]} 26. Bc3 {[%clk 0:13:01]} c5 {[%clk 0:30:05]} 27. bxc5
{[%clk 0:10:32]} Nxc5 {[%clk 0:30:05]} 28. Qb1 {[%clk 0:10:32]} Ra8
{[%clk 0:30:05]} 29. d4 {[%clk 0:10:32]} exd4 {[%clk 0:30:05]} 30. Nxd4
{[%clk 0:10:32]} Bxd4 {[%clk 0:30:05]} 31. Bxd4 {[%clk 0:10:32]} Rc8
{[%clk 0:30:05]} 32. Ba1 {[%clk 0:10:32]} Nf6 {[%clk 0:30:05]} 33. e5
{[%clk 0:10:32]} dxe5 {[%clk 0:30:05]} 34. Bxe5 {[%clk 0:10:32]} Nfd7
{[%clk 0:30:05]} 35. Bc3 {[%clk 0:10:32]} Qe3 {[%clk 0:30:05]} 36. Ba1
{[%clk 0:10:32]} Re8 {[%clk 0:30:05]} 37. Qb2 {[%clk 0:10:32]} Nf6
{[%clk 0:30:05]} 38. Qd4 {[%clk 0:10:32]} b6 {[%clk 0:30:05]} 39. Qxe3
{[%clk 0:10:32]} Rxe3 {[%clk 0:30:05]} 40. Bd4 {[%clk 0:10:32]} Rd3
{[%clk 0:30:05]} 41. Bf2 {[%clk 0:10:32]} Rc3 {[%clk 0:30:05]} 42. Bxh4
{[%clk 0:10:32]} Rd3 {[%clk 1:05:01]} 43. Bf2 Rc3 {[%clk 1:04:48]} 44. Bh4
{[%clk 0:54:55]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.09"]
[Round "1.3"]
[White "Kramnik, Vladimir"]
[Black "Topalov, Veselin"]
[Result "1-0"]
[BlackElo "2760"]
[WhiteElo "2809"]
[LiveChessVersion "1.4.8"]
[ECO "A06"]

1. Nf3 {[%clk 1:59:56]} d5 {[%clk 1:59:37]} 2. g3 {[%clk 1:59:49]} g6
{[%clk 1:59:16]} 3. Bg2 {[%clk 1:59:41]} Bg7 {[%clk 1:58:55]} 4. d4
{[%clk 1:59:39]} Nf6 {[%clk 1:58:47]} 5. O-O {[%clk 1:59:33]} O-O
{[%clk 1:58:39]} 6. c4 {[%clk 1:59:28]} c5 {[%clk 1:56:45]} 7. dxc5
{[%clk 1:57:33]} dxc4 {[%clk 1:55:19]} 8. Na3 {[%clk 1:52:41]} c3
{[%clk 1:52:15]} 9. Nb5 {[%clk 1:51:57]} cxb2 {[%clk 1:48:30]} 10. Bxb2
{[%clk 1:51:16]} Bd7 {[%clk 1:41:06]} 11. Qb3 {[%clk 1:41:52]} Bc6
{[%clk 1:36:29]} 12. Rfd1 {[%clk 1:38:09]} Qc8 {[%clk 1:35:37]} 13. Rac1
{[%clk 1:36:51]} Nbd7 {[%clk 1:27:49]} 14. Nbd4 {[%clk 1:32:32]} Bd5
{[%clk 1:24:56]} 15. Qa3 {[%clk 1:26:55]} Re8 {[%clk 1:17:49]} 16. c6
{[%clk 1:19:01]} Nb6 {[%clk 1:13:06]} 17. c7 {[%clk 1:09:10]} Nc4
{[%clk 1:11:11]} 18. Qb4 {[%clk 1:05:36]} Nxb2 {[%clk 1:09:17]} 19. Qxb2
{[%clk 1:03:20]} b6 {[%clk 1:07:01]} 20. Qa3 {[%clk 0:53:04]} e6 {[%clk 1:00:11]}
21. Nb5 {[%clk 0:49:28]} Bf8 {[%clk 0:53:38]} 22. Qb2 {[%clk 0:48:03]} Bg7
{[%clk 0:38:59]} 23. Qd2 {[%clk 0:35:08]} Qd7 {[%clk 0:28:32]} 24. a4
{[%clk 0:33:37]} Ne4 {[%clk 0:26:49]} 25. Qf4 {[%clk 0:27:50]} a6
{[%clk 0:20:48]} 26. Qxe4 {[%clk 0:25:54]} axb5 {[%clk 0:17:11]} 27. Qd3
{[%clk 0:21:35]} f5 {[%clk 0:12:33]} 28. Ng5 {[%clk 0:19:04]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.09"]
[Round "1.4"]
[White "Vachier-Lagrave, Maxime"]
[Black "Giri, Anish"]
[Result "1/2-1/2"]
[BlackElo "2771"]
[WhiteElo "2804"]
[LiveChessVersion "1.4.8"]
[ECO "B90"]

1. e4 {[%clk 1:59:54]} c5 {[%clk 1:59:57]} 2. Nf3 {[%clk 1:59:49]} d6
{[%clk 1:59:55]} 3. d4 {[%clk 1:59:45]} cxd4 {[%clk 1:59:51]} 4. Nxd4
{[%clk 1:59:41]} Nf6 {[%clk 1:59:48]} 5. Nc3 {[%clk 1:59:38]} a6 {[%clk 1:59:45]}
6. h3 {[%clk 1:59:11]} e5 {[%clk 1:59:28]} 7. Nde2 {[%clk 1:59:07]} h5
{[%clk 1:59:23]} 8. g3 {[%clk 1:59:02]} Be6 {[%clk 1:59:17]} 9. Bg2
{[%clk 1:58:36]} b5 {[%clk 1:59:12]} 10. O-O {[%clk 1:57:51]} Nbd7
{[%clk 1:58:30]} 11. Be3 {[%clk 1:57:21]} Be7 {[%clk 1:58:04]} 12. Nd5
{[%clk 1:57:13]} Nxd5 {[%clk 1:57:21]} 13. exd5 {[%clk 1:57:09]} Bf5
{[%clk 1:57:17]} 14. f4 {[%clk 1:57:01]} Rc8 {[%clk 1:57:06]} 15. c3
{[%clk 1:55:55]} Bh7 {[%clk 1:56:58]} 16. a4 {[%clk 1:42:39]} O-O
{[%clk 1:54:22]} 17. axb5 {[%clk 1:41:04]} axb5 {[%clk 1:54:10]} 18. Ra6
{[%clk 1:32:38]} exf4 {[%clk 1:32:40]} 19. Nxf4 {[%clk 1:26:39]} h4
{[%clk 1:32:17]} 20. Bd4 {[%clk 1:17:53]} Ne5 {[%clk 1:23:51]} 21. Nh5
{[%clk 1:14:23]} Bg6 {[%clk 1:21:09]} 22. Nf4 {[%clk 1:07:01]} Bh7
{[%clk 1:18:56]} 23. Nh5 {[%clk 1:04:53]} Bg6 {[%clk 1:18:10]} 24. Nf4
{[%clk 1:00:08]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.09"]
[Round "1.5"]
[White "Aronian, Levon"]
[Black "Adams, Michael"]
[Result "1-0"]
[BlackElo "2748"]
[WhiteElo "2785"]
[LiveChessVersion "1.4.8"]
[ECO "C50"]

1. e4 {[%clk 1:59:56]} e5 {[%clk 1:59:54]} 2. Nf3 {[%clk 1:59:52]} Nc6
{[%clk 1:59:49]} 3. Bc4 {[%clk 1:59:47]} Bc5 {[%clk 1:59:42]} 4. d3
{[%clk 1:59:30]} Nf6 {[%clk 1:59:00]} 5. c3 {[%clk 1:58:59]} d6 {[%clk 1:57:13]}
6. Bg5 {[%clk 1:58:53]} h6 {[%clk 1:46:13]} 7. Bh4 {[%clk 1:58:48]} a6
{[%clk 1:46:04]} 8. Nbd2 {[%clk 1:58:38]} Ba7 {[%clk 1:45:08]} 9. Bb3
{[%clk 1:56:55]} Qe7 {[%clk 1:43:12]} 10. Nc4 {[%clk 1:45:33]} Be6
{[%clk 1:34:12]} 11. Ne3 {[%clk 1:40:15]} g5 {[%clk 1:24:48]} 12. Bg3
{[%clk 1:40:10]} O-O-O {[%clk 1:22:07]} 13. Ba4 {[%clk 1:33:22]} Nb8
{[%clk 1:17:59]} 14. Qc2 {[%clk 1:26:46]} Bxe3 {[%clk 1:08:47]} 15. fxe3
{[%clk 1:26:11]} Nh5 {[%clk 1:08:43]} 16. Bf2 {[%clk 1:19:53]} f5
{[%clk 1:06:48]} 17. exf5 {[%clk 1:19:01]} Bxf5 {[%clk 1:06:39]} 18. Qe2
{[%clk 1:16:35]} Bxd3 {[%clk 0:45:54]} 19. Qxd3 {[%clk 1:16:24]} e4
{[%clk 0:45:51]} 20. Qd4 {[%clk 1:13:32]} c5 {[%clk 0:42:05]} 21. Qd1
{[%clk 1:10:32]} exf3 {[%clk 0:41:52]} 22. Qxf3 {[%clk 1:10:25]} Nf6
{[%clk 0:40:42]} 23. Bc2 {[%clk 1:10:10]} Nbd7 {[%clk 0:31:10]} 24. O-O-O
{[%clk 1:06:35]} Ne5 {[%clk 0:30:31]} 25. Qe2 {[%clk 1:02:12]} Qe6
{[%clk 0:25:16]} 26. Bg3 {[%clk 1:02:05]} Qxa2 {[%clk 0:16:44]} 27. Rhf1
{[%clk 0:46:08]} Nd5 {[%clk 0:15:37]} 28. Bxe5 {[%clk 0:44:29]} dxe5
{[%clk 0:14:58]} 29. Bb1 {[%clk 0:39:22]} Qb3 {[%clk 0:10:33]} 30. Bc2
{[%clk 0:35:28]} Qa2 {[%clk 0:10:31]} 31. Qg4+ {[%clk 0:34:08]} Kb8
{[%clk 0:10:22]} 32. Qe4 {[%clk 0:33:49]} Nb6 {[%clk 0:05:19]} 33. Qxe5+
{[%clk 0:30:08]} Ka8 {[%clk 0:05:12]} 34. Rxd8+ {[%clk 0:26:50]} Rxd8
{[%clk 0:05:10]} 35. Qf6 {[%clk 0:25:58]} Nc4 {[%clk 0:02:38]} 36. Qxd8+
{[%clk 0:25:53]} Ka7 {[%clk 0:02:37]} 37. Qd3 {[%clk 0:25:39]} Nxb2
{[%clk 0:00:53]} 38. Qf5 {[%clk 0:24:24]} Qa1+ {[%clk 0:00:34]} 39. Kd2
{[%clk 0:24:10]} Nc4+ {[%clk 0:00:30]} 40. Ke2 {[%clk 1:24:25]} Qxc3
{[%clk 1:00:48]} 41. Qxc5+ {[%clk 1:24:46]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.10"]
[Round "2.1"]
[White "Kramnik, Vladimir"]
[Black "Aronian, Levon"]
[Result "1/2-1/2"]
[BlackElo "2785"]
[WhiteElo "2809"]
[LiveChessVersion "1.4.8"]
[ECO "A06"]

1. Nf3 {[%clk 1:59:56]} d5 {[%clk 1:59:48]} 2. g3 {[%clk 1:59:51]} Nf6
{[%clk 1:59:35]} 3. Bg2 {[%clk 1:59:43]} e6 {[%clk 1:59:30]} 4. O-O
{[%clk 1:59:35]} Be7 {[%clk 1:59:26]} 5. c4 {[%clk 1:59:27]} O-O {[%clk 1:59:19]}
6. b3 {[%clk 1:59:24]} b6 {[%clk 1:59:02]} 7. Nc3 {[%clk 1:57:48]} Bb7
{[%clk 1:58:37]} 8. d4 {[%clk 1:57:39]} Nbd7 {[%clk 1:51:27]} 9. Bb2
{[%clk 1:57:04]} Rc8 {[%clk 1:49:04]} 10. cxd5 {[%clk 1:51:22]} Nxd5
{[%clk 1:48:42]} 11. Nxd5 {[%clk 1:51:00]} Bxd5 {[%clk 1:48:15]} 12. Qd3
{[%clk 1:49:17]} c5 {[%clk 1:44:05]} 13. e4 {[%clk 1:42:22]} Bb7 {[%clk 1:38:23]}
14. Rad1 {[%clk 1:35:36]} cxd4 {[%clk 1:32:43]} 15. Nxd4 {[%clk 1:27:02]} Nf6
{[%clk 1:32:34]} 16. Qe2 {[%clk 1:14:51]} Qe8 {[%clk 1:32:21]} 17. a3
{[%clk 1:09:06]} a5 {[%clk 1:29:26]} 18. Rfe1 {[%clk 1:03:51]} Bc5
{[%clk 1:18:34]} 19. Nb5 {[%clk 0:52:27]} Qe7 {[%clk 1:05:06]} 20. e5
{[%clk 0:41:55]} Bxg2 {[%clk 1:04:53]} 21. exf6 {[%clk 0:41:39]} Qb7
{[%clk 1:04:50]} 22. Nd6 {[%clk 0:34:34]} Bxd6 {[%clk 1:04:45]} 23. Rxd6
{[%clk 0:34:07]} Bh1 {[%clk 1:01:10]} 24. f3 {[%clk 0:31:29]} Qxf3
{[%clk 0:52:24]} 25. Qd2 {[%clk 0:17:07]} Qg2+ {[%clk 0:51:15]} 26. Qxg2
{[%clk 0:14:48]} Bxg2 {[%clk 0:51:09]} 27. fxg7 {[%clk 0:14:36]} Rfe8
{[%clk 0:51:06]} 28. Re2 {[%clk 0:11:37]} Bf3 {[%clk 0:48:30]} 29. Rf2
{[%clk 0:11:19]} Be4 {[%clk 0:43:32]} 30. Re2 {[%clk 0:08:52]} Bf3
{[%clk 0:43:10]} 31. Rf2 {[%clk 0:08:04]} Be4 {[%clk 0:43:05]} 32. Re2
{[%clk 0:07:08]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.10"]
[Round "2.2"]
[White "Anand, Viswanathan"]
[Black "Vachier-Lagrave, Maxime"]
[Result "1-0"]
[BlackElo "2804"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "B90"]

1. e4 {[%clk 1:59:57]} c5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:51]} d6
{[%clk 1:59:53]} 3. d4 {[%clk 1:59:44]} cxd4 {[%clk 1:59:49]} 4. Nxd4
{[%clk 1:59:39]} Nf6 {[%clk 1:59:41]} 5. Nc3 {[%clk 1:59:32]} a6 {[%clk 1:59:38]}
6. h3 {[%clk 1:59:25]} e5 {[%clk 1:59:30]} 7. Nb3 {[%clk 1:59:18]} Be6
{[%clk 1:59:06]} 8. f4 {[%clk 1:58:54]} Nbd7 {[%clk 1:55:33]} 9. g4
{[%clk 1:56:17]} Rc8 {[%clk 1:51:36]} 10. f5 {[%clk 1:54:36]} Bxb3
{[%clk 1:49:45]} 11. axb3 {[%clk 1:54:27]} d5 {[%clk 1:43:31]} 12. exd5
{[%clk 1:53:43]} Bb4 {[%clk 1:43:14]} 13. Bg2 {[%clk 1:53:33]} Qb6
{[%clk 1:38:25]} 14. Bd2 {[%clk 1:47:33]} e4 {[%clk 1:27:50]} 15. Qe2
{[%clk 1:44:44]} O-O {[%clk 1:27:34]} 16. O-O-O {[%clk 1:41:36]} Nc5
{[%clk 1:25:58]} 17. Kb1 {[%clk 1:34:55]} Rfd8 {[%clk 1:08:52]} 18. Rhe1
{[%clk 1:24:32]} a5 {[%clk 0:51:01]} 19. Qf2 {[%clk 1:10:18]} Qc7
{[%clk 0:32:37]} 20. Bf4 {[%clk 0:48:55]} Qb6 {[%clk 0:29:59]} 21. Be5
{[%clk 0:45:15]} a4 {[%clk 0:28:32]} 22. bxa4 Bxc3 {[%clk 0:27:46]} 23. Bxc3
{[%clk 0:37:29]} Nxd5 {[%clk 0:27:30]} 24. Rxd5 Rxd5 {[%clk 0:27:24]} 25. Bxe4
{[%clk 0:29:50]} Rd6 {[%clk 0:23:17]} 26. a5 {[%clk 0:26:47]} Qb5
{[%clk 0:17:35]} 27. Qe2 {[%clk 0:25:04]} Qxe2 {[%clk 0:14:13]} 28. Rxe2
{[%clk 0:24:59]} Rd1+ {[%clk 0:13:19]} 29. Ka2 {[%clk 0:24:53]} Re8
{[%clk 0:13:13]} 30. Bf3 {[%clk 0:24:43]} Rxe2 {[%clk 0:13:09]} 31. Bxe2
{[%clk 0:24:38]} Rc1 {[%clk 0:13:02]} 32. Bf3 {[%clk 0:24:17]} Rxc2
{[%clk 0:12:11]} 33. Bxb7 {[%clk 0:22:24]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.10"]
[Round "2.3"]
[White "So, Wesley"]
[Black "Adams, Michael"]
[Result "1-0"]
[BlackElo "2748"]
[WhiteElo "2794"]
[LiveChessVersion "1.4.8"]
[ECO "E06"]

1. d4 {[%clk 1:59:58]} Nf6 {[%clk 1:59:53]} 2. c4 {[%clk 1:59:52]} e6
{[%clk 1:59:49]} 3. g3 {[%clk 1:59:48]} d5 {[%clk 1:59:35]} 4. Bg2
{[%clk 1:59:42]} Be7 {[%clk 1:58:31]} 5. Nf3 {[%clk 1:59:35]} O-O
{[%clk 1:58:26]} 6. O-O {[%clk 1:59:30]} dxc4 {[%clk 1:58:23]} 7. Qc2
{[%clk 1:59:24]} a6 {[%clk 1:58:19]} 8. a4 {[%clk 1:59:19]} Bd7 {[%clk 1:57:47]}
9. Qxc4 {[%clk 1:59:14]} Bc6 {[%clk 1:57:17]} 10. Bg5 {[%clk 1:59:08]} a5
{[%clk 1:54:17]} 11. Nc3 {[%clk 1:56:11]} Ra6 {[%clk 1:50:30]} 12. Qd3
{[%clk 1:53:50]} Rb6 {[%clk 1:47:38]} 13. Qc2 {[%clk 1:53:36]} h6
{[%clk 1:46:03]} 14. Bd2 {[%clk 1:45:51]} Bb4 {[%clk 1:25:33]} 15. Rfe1
{[%clk 1:35:51]} Bxf3 {[%clk 1:22:56]} 16. Bxf3 {[%clk 1:35:45]} Nc6
{[%clk 1:22:53]} 17. e3 {[%clk 1:33:04]} e5 {[%clk 1:20:37]} 18. Bxc6
{[%clk 1:22:41]} exd4 {[%clk 1:19:11]} 19. Bf3 {[%clk 1:21:49]} dxc3
{[%clk 1:18:28]} 20. bxc3 {[%clk 1:21:19]} Bc5 {[%clk 1:15:18]} 21. Rab1
{[%clk 0:52:29]} Rd6 {[%clk 1:11:08]} 22. Red1 {[%clk 0:48:17]} b6
{[%clk 1:09:38]} 23. c4 {[%clk 0:47:58]} Qe7 {[%clk 1:05:12]} 24. Bc3
{[%clk 0:46:31]} Rfd8 {[%clk 1:04:29]} 25. Bb2 {[%clk 0:40:34]} Qe6
{[%clk 0:50:12]} 26. Rxd6 {[%clk 0:38:31]} Rxd6 {[%clk 0:49:14]} 27. Rd1
{[%clk 0:38:10]} Rxd1+ {[%clk 0:42:23]} 28. Qxd1 {[%clk 0:38:06]} Bd6
{[%clk 0:41:13]} 29. Qd4 {[%clk 0:24:54]} Qe8 {[%clk 0:38:18]} 30. Bd1
{[%clk 0:23:47]} Qc6 {[%clk 0:28:04]} 31. Bc2 {[%clk 0:21:35]} Kf8
{[%clk 0:27:24]} 32. e4 {[%clk 0:16:42]} Bc5 {[%clk 0:12:50]} 33. Qd8+
{[%clk 0:16:38]} Ne8 {[%clk 0:12:46]} 34. Qd5 {[%clk 0:16:33]} Qg6
{[%clk 0:12:33]} 35. Kg2 {[%clk 0:15:48]} Ke7 {[%clk 0:07:59]} 36. f4
{[%clk 0:13:35]} c6 {[%clk 0:06:39]} 37. Qd3 {[%clk 0:13:21]} Nc7
{[%clk 0:04:12]} 38. f5 {[%clk 0:11:48]} Qg5 {[%clk 0:01:56]} 39. Be5
{[%clk 1:10:21]} Ne6 {[%clk 1:00:33]} 40. fxe6 {[%clk 1:10:07]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.10"]
[Round "2.4"]
[White "Topalov, Veselin"]
[Black "Caruana, Fabiano"]
[Result "0-1"]
[BlackElo "2823"]
[WhiteElo "2760"]
[LiveChessVersion "1.4.8"]
[ECO "C02"]

1. e4 {[%clk 1:59:55]} e6 {[%clk 1:59:52]} 2. d4 {[%clk 1:59:44]} d5
{[%clk 1:59:47]} 3. e5 {[%clk 1:58:31]} c5 {[%clk 1:59:38]} 4. c3
{[%clk 1:58:27]} Nc6 {[%clk 1:59:07]} 5. Nf3 {[%clk 1:58:19]} Bd7
{[%clk 1:50:16]} 6. Be2 {[%clk 1:55:25]} Nge7 {[%clk 1:46:12]} 7. h4 Qb6
{[%clk 1:19:02]} 8. Na3 {[%clk 1:51:50]} cxd4 {[%clk 1:16:39]} 9. cxd4
{[%clk 1:51:44]} Nb4 {[%clk 1:15:36]} 10. h5 {[%clk 1:45:11]} h6 {[%clk 1:15:31]}
11. Bd2 {[%clk 1:42:23]} a6 {[%clk 1:13:35]} 12. Bc3 {[%clk 1:39:58]} Nec6
{[%clk 1:12:54]} 13. Rh3 {[%clk 1:34:44]} O-O-O {[%clk 1:09:47]} 14. Kf1
{[%clk 1:27:01]} Kb8 {[%clk 1:03:17]} 15. Qd2 {[%clk 1:24:20]} f6
{[%clk 0:51:49]} 16. exf6 {[%clk 1:17:20]} gxf6 {[%clk 0:51:39]} 17. Rg3
{[%clk 1:16:50]} Be8 {[%clk 0:47:13]} 18. Nh4 {[%clk 1:13:43]} Bd6
{[%clk 0:37:49]} 19. Rg7 {[%clk 1:09:01]} e5 {[%clk 0:36:45]} 20. dxe5
{[%clk 0:57:00]} fxe5 {[%clk 0:35:58]} 21. Ng6 {[%clk 0:56:35]} Bxg6
{[%clk 0:19:26]} 22. hxg6 {[%clk 0:56:29]} e4 {[%clk 0:17:55]} 23. Rf7
{[%clk 0:53:18]} Rhg8 {[%clk 0:11:06]} 24. g7 {[%clk 0:47:40]} Ka7 25. Qxh6
{[%clk 0:40:28]} Nd3 {[%clk 0:09:51]} 26. Bxd3 {[%clk 0:32:06]} exd3
{[%clk 0:09:46]} 27. Re1 {[%clk 0:31:39]} Bc5 {[%clk 0:07:09]} 28. Re6
{[%clk 0:29:33]} Rc8 {[%clk 0:04:11]} 29. Qg5 {[%clk 0:24:41]} Bd4
{[%clk 0:02:36]} 30. Re1 {[%clk 0:15:54]} Bxc3 {[%clk 0:02:00]} 31. bxc3
{[%clk 0:15:49]} Qb2 {[%clk 0:01:30]} 32. Nb1 {[%clk 0:14:25]} Rce8
{[%clk 0:01:13]} 33. Qd2 {[%clk 0:10:54]} Rxe1+ {[%clk 0:01:11]} 34. Qxe1
{[%clk 0:10:46]} d4 {[%clk 0:01:09]} 35. Nd2 {[%clk 0:07:09]} dxc3
{[%clk 0:00:53]} 36. Nc4 {[%clk 0:06:19]} Re8 {[%clk 0:00:30]} 37. Rxb7+ Qxb7
{[%clk 0:00:24]} 38. Qxe8 {[%clk 0:01:49]} Qb1+ {[%clk 0:00:22]} 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.10"]
[Round "2.5"]
[White "Giri, Anish"]
[Black "Nakamura, Hikaru"]
[Result "1/2-1/2"]
[BlackElo "2779"]
[WhiteElo "2771"]
[LiveChessVersion "1.4.8"]
[ECO "A49"]

1. d4 {[%clk 1:59:57]} Nf6 {[%clk 1:59:54]} 2. Nf3 {[%clk 1:59:52]} g6
{[%clk 1:59:48]} 3. g3 {[%clk 1:55:42]} Bg7 {[%clk 1:59:30]} 4. Bg2
{[%clk 1:55:37]} O-O {[%clk 1:59:16]} 5. c4 {[%clk 1:54:55]} c5 {[%clk 1:58:37]}
6. Nc3 {[%clk 1:53:03]} cxd4 {[%clk 1:57:01]} 7. Qxd4 {[%clk 1:51:30]} Qa5
{[%clk 1:14:02]} 8. O-O {[%clk 1:45:36]} Qh5 {[%clk 1:12:08]} 9. Qe5
{[%clk 1:37:01]} Qxe5 {[%clk 1:10:44]} 10. Nxe5 {[%clk 1:36:57]} Nc6
{[%clk 1:10:39]} 11. Nd3 {[%clk 1:35:40]} b6 {[%clk 0:57:35]} 12. Bg5
{[%clk 1:06:58]} Ba6 {[%clk 0:51:49]} 13. b3 {[%clk 1:05:55]} h6 {[%clk 0:50:36]}
14. Bd2 {[%clk 1:02:46]} Rac8 {[%clk 0:50:07]} 15. Rac1 {[%clk 1:02:22]} Rfd8
{[%clk 0:49:56]} 16. Rfd1 {[%clk 1:00:17]} e6 {[%clk 0:48:43]} 17. Bf4
{[%clk 0:55:22]} Ne8 {[%clk 0:44:02]} 18. h4 {[%clk 0:53:48]} Bf8
{[%clk 0:36:58]} 19. Ne5 {[%clk 0:51:17]} Nxe5 {[%clk 0:35:25]} 20. Bxe5
{[%clk 0:51:12]} Bg7 {[%clk 0:35:16]} 21. Bxg7 {[%clk 0:49:39]} Kxg7
{[%clk 0:35:10]} 22. a4 {[%clk 0:45:19]} g5 {[%clk 0:27:26]} 23. hxg5
{[%clk 0:40:56]} hxg5 {[%clk 0:27:21]} 24. e3 {[%clk 0:29:29]} Nf6
{[%clk 0:26:12]} 25. Rd6 {[%clk 0:23:39]} Kf8 {[%clk 0:25:44]} 26. Rcd1
{[%clk 0:21:26]} Rc5 {[%clk 0:21:01]} 27. Na2 {[%clk 0:19:39]} Bc8
{[%clk 0:19:21]} 28. Nb4 {[%clk 0:19:28]} Re8 {[%clk 0:19:18]} 29. Nd3
{[%clk 0:17:50]} Ra5 {[%clk 0:17:25]} 30. Nb2 {[%clk 0:16:58]} Rc5
{[%clk 0:17:20]} 31. Nd3 {[%clk 0:16:25]} Ra5 {[%clk 0:17:06]} 32. Nb2
{[%clk 0:16:11]} Rc5 {[%clk 0:17:01]} 33. R6d2 {[%clk 0:15:15]} g4
{[%clk 0:14:51]} 34. Nd3 {[%clk 0:13:57]} Rc7 {[%clk 0:14:37]} 35. Ne5
{[%clk 0:12:18]} Ke7 {[%clk 0:14:15]} 36. a5 {[%clk 0:11:24]} bxa5
{[%clk 0:11:59]} 37. Ra2 {[%clk 0:10:34]} Bb7 {[%clk 0:11:31]} 38. Rxa5
{[%clk 0:10:01]} Bxg2 {[%clk 0:11:23]} 39. Kxg2 {[%clk 0:10:00]} Rb8
{[%clk 0:11:14]} 40. Ra3 {[%clk 1:08:37]} Rc5 {[%clk 1:08:24]} 41. Nd3
{[%clk 1:06:50]} Rc7 {[%clk 1:05:33]} 42. Ne5 {[%clk 1:02:50]} Rc5
{[%clk 1:05:27]} 43. Nd3 {[%clk 1:03:17]} Rc7 {[%clk 1:05:56]} 1/2-1/2
';

    private $pgn = '[Event "4th match"]
[Site "London"]
[Date "1834.??.??"]
[Round "62"]
[White "McDonnell,A"]
[Black "De La Bourdonnais,L"]
[Result "0-1"] 

1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 e5 5.Nxc6 bxc6 6.Bc4 Nf6 7.Bg5 Be7 8.Qe2 d5 9.Bxf6 Bxf6 10.Bb3 O-O 11.O-O a5 12.exd5 cxd5 13.Rd1 d4 14.c4 Qb6 15.Bc2 Bb7 16.Nd2 Rae8 17.Ne4 Bd8 18.c5 Qc6 19.f3 Be7 20.Rac1 f5 21.Qc4+ Kh8 22.Ba4 Qh6 23.Bxe8 fxe4 24.c6 exf3 25.Rc2 Bc8 26.Bd7 Qe3+ 27.Kh1 f2 28.Rf1 d3 29.Rc3 Bxd7 30.cxd7 e4 31.Qc8 Bd8 32.Qc4 Qe1 33.Rc1 d2 34.Qc5 Rg8 35.Rd1 e3 36.Qc3 Qxd1 37.Rxd1 e2 0-1 

[Event "Immortal game"]
[Site "London"]
[Date "1851.??.??"]
[Round "?"]
[White "Anderssen,A"]
[Black "Kieseritzky,L"]
[Result "1-0"] 

1.e4 e5 2.f4 exf4 3.Bc4 Qh4+ 4.Kf1 b5 5.Bxb5 Nf6 6.Nf3 Qh6 7.d3 Nh5 8.Nh4 Qg5 9.Nf5 c6 10.g4 Nf6 11.Rg1 cxb5 12.h4 Qg6 13.h5 Qg5 14.Qf3 Ng8 15.Bxf4 Qf6 16.Nc3 Bc5 17.Nd5 Qxb2 18.Bd6 Qxa1+ 19.Ke2 Bxg1 20.e5 Na6 21.Nxg7+ Kd8 22.Qf6+ Nxf6 23.Be7+ 1-0 

[Event "Evergreen game"]
[Site "Berlin"]
[Date "1852"]
[Round "?"]
[White "Anderssen,A"]
[Black "Dufresne,J"]
[Result "1-0"] 

1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O d3 8.Qb3 Qf6 9.e5 Qg6 10.Re1 Nge7 11.Ba3 b5 12.Qxb5 Rb8 13.Qa4 Bb6 14.Nbd2 Bb7 15.Ne4 Qf5 16.Bxd3 Qh5 17.Nf6+ gxf6 18.exf6 Rg8 19.Rad1 Qxf3 20.Rxe7+ Nxe7 21.Qxd7+ Kxd7 22.Bf5+ Ke8 23.Bd7+ Kf8 24.Bxe7+ 1-0 

[Event "ch 4th match"]
[Site "USA"]
[Date "1857.??.??"]
[Round "6"]
[White "Paulsen,L"]
[Black "Morphy,P"]
[Result "0-1"] 

1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.Bb5 Bc5 5.O-O O-O 6.Nxe5 Re8 7.Nxc6 dxc6 8.Bc4 b5 9.Be2 Nxe4 10.Nxe4 Rxe4 11.Bf3 Re6 12.c3 Qd3 13.b4 Bb6 14.a4 bxa4 15.Qxa4 Bd7 16.Ra2 Rae8 17.Qa6 Qxf3 18.gxf3 Rg6+ 19.Kh1 Bh3 20.Rd1 Bg2+ 21.Kg1 Bxf3+ 22.Kf1 Bg2+ 23.Kg1 Bh3+ 24.Kh1 Bxf2 25.Qf1 Bxf1 26.Rxf1 Re2 27.Ra1 Rh6 28.d4 Be3 0-1 

[Event "?"]
[Site "Barmen"]
[Date "1869.??.??"]
[Round "?"]
[White "Anderssen,A"]
[Black "Zukertort,J"]
[Result "1-0"] 

1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 Bxb4 5.c3 Ba5 6.d4 exd4 7.O-O Bb6 8.cxd4 d6 9.d5 Na5 10.Bb2 Ne7 11.Bd3 O-O 12.Nc3 Ng6 13.Ne2 c5 14.Qd2 f6 15.Kh1 Bc7 16.Rac1 Rb8 17.Ng3 b5 18.Nf5 b4 19.Rg1 Bb6 20.g4 Ne5 21.Bxe5 dxe5 22.Rg3 Rf7 23.g5 Bxf5 24.exf5 Qxd5 25.gxf6 Rd8 26.Rcg1 Kh8 27.fxg7+ Kg8 28.Qh6 Qd6 29.Qxh7+ Kxh7 30.f6+ Kg8 31.Bh7+ Kxh7 32.Rh3+ Kg8 33.Rh8+ 1-0 

[Event "?"]
[Site "London"]
[Date "1883.??.??"]
[Round "?"]
[White "Zukertort,J"]
[Black "Blackburne,J"]
[Result "1-0"] 

1.c4 e6 2.e3 Nf6 3.Nf3 b6 4.Be2 Bb7 5.O-O d5 6.d4 Bd6 7.Nc3 O-O 8.b3 Nbd7 9.Bb2 Qe7 10.Nb5 Ne4 11.Nxd6 cxd6 12.Nd2 Ndf6 13.f3 Nxd2 14.Qxd2 dxc4 15.Bxc4 d5 16.Bd3 Rfc8 17.Rae1 Rc7 18.e4 Rac8 19.e5 Ne8 20.f4 g6 21.Re3 f6 22.exf6 Nxf6 23.f5 Ne4 24.Bxe4 dxe4 25.fxg6 Rc2 26.gxh7+ Kh8 27.d5+ e5 28.Qb4 R8c5 29.Rf8+ Kxh7 30.Qxe4+ Kg7 31.Bxe5+ Kxf8 32.Bg7+ 1-0 

[Event "WCh"]
[Site "USA"]
[Date "1886.??.??"]
[Round "9"]
[White "Zukertort,J"]
[Black "Steinitz,W"]
[Result "0-1"] 

1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Nf3 dxc4 5.e3 c5 6.Bxc4 cxd4 7.exd4 Be7 8.O-O O-O 9.Qe2 Nbd7 10.Bb3 Nb6 11.Bf4 Nbd5 12.Bg3 Qa5 13.Rac1 Bd7 14.Ne5 Rfd8 15.Qf3 Be8 16.Rfe1 Rac8 17.Bh4 Nxc3 18.bxc3 Qc7 19.Qd3 Nd5 20.Bxe7 Qxe7 21.Bxd5 Rxd5 22.c4 Rdd8 23.Re3 Qd6 24.Rd1 f6 25.Rh3 h6 26.Ng4 Qf4 27.Ne3 Ba4 28.Rf3 Qd6 29.Rd2 Bc6 30.Rg3 f5 31.Rg6 Be4 32.Qb3 Kh7 33.c5 Rxc5 34.Rxe6 Rc1+ 35.Nd1 Qf4 36.Qb2 Rb1 37.Qc3 Rc8 38.Rxe4 Qxe4 0-1 

[Event "?"]
[Site "Amsterdam"]
[Date "1889.??.??"]
[Round "?"]
[White "Lasker,Em"]
[Black "Bauer,I"]
[Result "1-0"] 

1.f4 d5 2.e3 Nf6 3.b3 e6 4.Bb2 Be7 5.Bd3 b6 6.Nf3 Bb7 7.Nc3 Nbd7 8.O-O O-O 9.Ne2 c5 10.Ng3 Qc7 11.Ne5 Nxe5 12.Bxe5 Qc6 13.Qe2 a6 14.Nh5 Nxh5 15.Bxh7+ Kxh7 16.Qxh5+ Kg8 17.Bxg7 Kxg7 18.Qg4+ Kh7 19.Rf3 e5 20.Rh3+ Qh6 21.Rxh6+ Kxh6 22.Qd7 Bf6 23.Qxb7 Kg7 24.Rf1 Rab8 25.Qd7 Rfd8 26.Qg4+ Kf8 27.fxe5 Bg7 28.e6 Rb7 29.Qg6 f6 30.Rxf6+ Bxf6 31.Qxf6+ Ke8 32.Qh8+ Ke7 33.Qg7+ 1-0 

[Event "WCh"]
[Site "Havana"]
[Date "1892.??.??"]
[Round "4"]
[White "Steinitz,W"]
[Black "Chigorin,M"]
[Result "1-0"] 

1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.d3 d6 5.c3 g6 6.Nbd2 Bg7 7.Nf1 O-O 8.Ba4 Nd7 9.Ne3 Nc5 10.Bc2 Ne6 11.h4 Ne7 12.h5 d5 13.hxg6 fxg6 14.exd5 Nxd5 15.Nxd5 Qxd5 16.Bb3 Qc6 17.Qe2 Bd7 18.Be3 Kh8 19.O-O-O Rae8 20.Qf1 a5 21.d4 exd4 22.Nxd4 Bxd4 23.Rxd4 Nxd4 24.Rxh7+ Kxh7 25.Qh1+ Kg7 26.Bh6+ Kf6 27.Qh4+ Ke5 28.Qxd4+ Kf5 29.Qf4+ 1-0 

[Event "?"]
[Site "Hastings"]
[Date "1895.??.??"]
[Round "?"]
[White "Steinitz,W"]
[Black "Von Bardeleben,C"]
[Result "1-0"] 

1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Nc3 d5 8.exd5 Nxd5 9.O-O Be6 10.Bg5 Be7 11.Bxd5 Bxd5 12.Nxd5 Qxd5 13.Bxe7 Nxe7 14.Re1 f6 15.Qe2 Qd7 16.Rac1 c6 17.d5 cxd5 18.Nd4 Kf7 19.Ne6 Rhc8 20.Qg4 g6 21.Ng5+ Ke8 22.Rxe7+ Kf8 23.Rf7+ Kg8 24.Rg7+ Kh8 25.Rxh7+ Kg8 26.Rg7+ Kh8 27.Qh4+ Kxg7 28.Qh7+ Kf8 29.Qh8+ Ke7 30.Qg7+ Ke8 31.Qg8+ Ke7 32.Qf7+ Kd8 33.Qf8+ Qe8 34.Nf7+ Kd7 35.Qd6+ 1-0 

[Event "?"]
[Site "St.Petersburg"]
[Date "1896.??.??"]
[Round "?"]
[White "Pillsbury,H"]
[Black "Lasker,Em"]
[Result "0-1"] 

1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Nf3 c5 5.Bg5 cxd4 6.Qxd4 Nc6 7.Qh4 Be7 8.O-O-O Qa5 9.e3 Bd7 10.Kb1 h6 11.cxd5 exd5 12.Nd4 O-O 13.Bxf6 Bxf6 14.Qh5 Nxd4 15.exd4 Be6 16.f4 Rac8 17.f5 Rxc3 18.fxe6 Ra3 19.exf7+ Rxf7 20.bxa3 Qb6+ 21.Bb5 Qxb5+ 22.Ka1 Rc7 23.Rd2 Rc4 24.Rhd1 Rc3 25.Qf5 Qc4 26.Kb2 Rxa3 27.Qe6+ Kh7 28.Kxa3 Qc3+ 29.Ka4 b5+ 30.Kxb5 Qc4+ 31.Ka5 Bd8+ 32.Qb6 Bxb6+ 0-1 

[Event "?"]
[Site "Nuernberg"]
[Date "1896.??.??"]
[Round "?"]
[White "Pillsbury,H"]
[Black "Lasker,Em"]
[Result "1-0"] 

1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.e5 Nfd7 5.f4 c5 6.dxc5 Nc6 7.a3 Nxc5 8.b4 Nd7 9.Bd3 a5 10.b5 Ncb8 11.Nf3 Nc5 12.Be3 Nbd7 13.O-O g6 14.Ne2 Be7 15.Qe1 Nb6 16.Nfd4 Bd7 17.Qf2 Nba4 18.Rab1 h5 19.b6 Nxd3 20.cxd3 Bxa3 21.f5 gxf5 22.Nf4 h4 23.Ra1 Be7 24.Rxa4 Bxa4 25.Ndxe6 fxe6 26.Nxe6 Bd7 27.Nxd8 Rxd8 28.Bc5 Rc8 29.Bxe7 Kxe7 30.Qe3 Rc6 31.Qg5+ Kf7 32.Rc1 Rxc1+ 33.Qxc1 Rc8 34.Qe1 h3 35.gxh3 Rg8+ 36.Kf2 a4 37.Qb4 Rg6 38.Kf3 a3 39.Qxa3 Rxb6 40.Qc5 Re6 41.Qc7 Ke7 42.Kf4 b6 43.h4 Rc6 44.Qb8 Be8 45.Kxf5 Rh6 46.Qc7+ Kf8 47.Qd8 b5 48.e6 Rh7 49.Ke5 b4 50.Qd6+ 1-0 

[Event "?"]
[Site "Cambridge Springs"]
[Date "1904.??.??"]
[Round "?"]
[White "Lasker,Em"]
[Black "Napier,W"]
[Result "1-0"] 

1.e4 c5 2.Nc3 Nc6 3.Nf3 g6 4.d4 cxd4 5.Nxd4 Bg7 6.Be3 d6 7.h3 Nf6 8.g4 O-O 9.g5 Ne8 10.h4 Nc7 11.f4 e5 12.Nde2 d5 13.exd5 Nd4 14.Nxd4 Nxd5 15.Nf5 Nxc3 16.Qxd8 Rxd8 17.Ne7+ Kh8 18.h5 Re8 19.Bc5 gxh5 20.Bc4 exf4 21.Bxf7 Ne4 22.Bxe8 Bxb2 23.Rb1 Bc3+ 24.Kf1 Bg4 25.Bxh5 Bxh5 26.Rxh5 Ng3+ 27.Kg2 Nxh5 28.Rxb7 a5 29.Rb3 Bg7 30.Rh3 Ng3 31.Kf3 Ra6 32.Kxf4 Ne2+ 33.Kf5 Nc3 34.a3 Na4 35.Be3 Bf8 36.Bd4+ Bg7 37.g6 1-0 

[Event "?"]
[Site "Lodz"]
[Date "1907.??.??"]
[Round "?"]
[White "Rotlevi,G"]
[Black "Rubinstein,A"]
[Result "0-1"] 

1.d4 d5 2.Nf3 e6 3.e3 c5 4.c4 Nc6 5.Nc3 Nf6 6.dxc5 Bxc5 7.a3 a6 8.b4 Bd6 9.Bb2 O-O 10.Qd2 Qe7 11.Bd3 dxc4 12.Bxc4 b5 13.Bd3 Rd8 14.Qe2 Bb7 15.O-O Ne5 16.Nxe5 Bxe5 17.f4 Bc7 18.e4 Rac8 19.e5 Bb6+ 20.Kh1 Ng4 21.Be4 Qh4 22.g3 Rxc3 23.gxh4 Rd2 24.Qxd2 Bxe4+ 25.Qg2 Rh3 0-1 

[Event "WCh"]
[Site "Paris"]
[Date "1909.??.??"]
[Round "2"]
[White "Janowski,D"]
[Black "Lasker,Em"]
[Result "0-1"] 

1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.Bb5 Bb4 5.O-O O-O 6.d3 d6 7.Bg5 Bxc3 8.bxc3 Ne7 9.Bc4 Ng6 10.Nh4 Nf4 11.Bxf4 exf4 12.Nf3 Bg4 13.h3 Bh5 14.Rb1 b6 15.Qd2 Bxf3 16.gxf3 Nh5 17.Kh2 Qf6 18.Rg1 Rae8 19.d4 Kh8 20.Rb5 Qh6 21.Rbg5 f6 22.R5g4 g6 23.Bd3 Re7 24.c4 Ng7 25.c3 Ne6 26.Bf1 f5 27.R4g2 Rf6 28.Bd3 g5 29.Rh1 g4 30.Be2 Ng5 31.fxg4 f3 32.Rg3 fxe2 0-1 

[Event "?"]
[Site "Karlsbad"]
[Date "1911.??.??"]
[Round "?"]
[White "Nimzovitch,A"]
[Black "Salwe,G"]
[Result "1-0"] 

1.e4 e6 2.d4 d5 3.e5 c5 4.c3 Nc6 5.Nf3 Qb6 6.Bd3 Bd7 7.dxc5 Bxc5 8.O-O f6 9.b4 Be7 10.Bf4 fxe5 11.Nxe5 Nxe5 12.Bxe5 Nf6 13.Nd2 O-O 14.Nf3 Bd6 15.Qe2 Rac8 16.Bd4 Qc7 17.Ne5 Be8 18.Rae1 Bxe5 19.Bxe5 Qc6 20.Bd4 Bd7 21.Qc2 Rf7 22.Re3 b6 23.Rg3 Kh8 24.Bxh7 e5 25.Bg6 Re7 26.Re1 Qd6 27.Be3 d4 28.Bg5 Rxc3 29.Rxc3 dxc3 30.Qxc3 Kg8 31.a3 Kf8 32.Bh4 Be8 33.Bf5 Qd4 34.Qxd4 exd4 35.Rxe7 Kxe7 36.Bd3 Kd6 37.Bxf6 gxf6 38.h4 1-0 

[Event "?"]
[Site "San Sebastian"]
[Date "1911.??.??"]
[Round "?"]
[White "Capablanca,J"]
[Black "Bernstein,O"]
[Result "1-0"] 

1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.O-O Be7 5.Nc3 d6 6.Bxc6+ bxc6 7.d4 exd4 8.Nxd4 Bd7 9.Bg5 O-O 10.Re1 h6 11.Bh4 Nh7 12.Bxe7 Qxe7 13.Qd3 Rab8 14.b3 Ng5 15.Rad1 Qe5 16.Qe3 Ne6 17.Nce2 Qa5 18.Nf5 Nc5 19.Ned4 Kh7 20.g4 Rbe8 21.f3 Ne6 22.Ne2 Qxa2 23.Neg3 Qxc2 24.Rc1 Qb2 25.Nh5 Rh8 26.Re2 Qe5 27.f4 Qb5 28.Nfxg7 Nc5 29.Nxe8 Bxe8 30.Qc3 f6 31.Nxf6+ Kg6 32.Nh5 Rg8 33.f5+ Kg5 34.Qe3+ Kh4 35.Qg3+ 1-0 

[Event "?"]
[Site "Breslau"]
[Date "1912.??.??"]
[Round "?"]
[White "Levitzky,S"]
[Black "Marshall,F"]
[Result "0-1"] 

1.d4 e6 2.e4 d5 3.Nc3 c5 4.Nf3 Nc6 5.exd5 exd5 6.Be2 Nf6 7.O-O Be7 8.Bg5 O-O 9.dxc5 Be6 10.Nd4 Bxc5 11.Nxe6 fxe6 12.Bg4 Qd6 13.Bh3 Rae8 14.Qd2 Bb4 15.Bxf6 Rxf6 16.Rad1 Qc5 17.Qe2 Bxc3 18.bxc3 Qxc3 19.Rxd5 Nd4 20.Qh5 Ref8 21.Re5 Rh6 22.Qg5 Rxh3 23.Rc5 Qg3 0-1 

[Event "?"]
[Site "St.Petersburg"]
[Date "1914.??.??"]
[Round "?"]
[White "Lasker,Em"]
[Black "Capablanca,J"]
[Result "1-0"] 

1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6 dxc6 5.d4 exd4 6.Qxd4 Qxd4 7.Nxd4 Bd6 8.Nc3 Ne7 9.O-O O-O 10.f4 Re8 11.Nb3 f6 12.f5 b6 13.Bf4 Bb7 14.Bxd6 cxd6 15.Nd4 Rad8 16.Ne6 Rd7 17.Rad1 Nc8 18.Rf2 b5 19.Rfd2 Rde7 20.b4 Kf7 21.a3 Ba8 22.Kf2 Ra7 23.g4 h6 24.Rd3 a5 25.h4 axb4 26.axb4 Rae7 27.Kf3 Rg8 28.Kf4 g6 29.Rg3 g5+ 30.Kf3 Nb6 31.hxg5 hxg5 32.Rh3 Rd7 33.Kg3 Ke8 34.Rdh1 Bb7 35.e5 dxe5 36.Ne4 Nd5 37.N6c5 Bc8 38.Nxd7 Bxd7 39.Rh7 Rf8 40.Ra1 Kd8 41.Ra8+ Bc8 42.Nc5 1-0 

[Event "?"]
[Site "St.Petersburg"]
[Date "1914.??.??"]
[Round "?"]
[White "Nimzovitch,A"]
[Black "Tarrasch,S"]
[Result "0-1"] 

1.d4 d5 2.Nf3 c5 3.c4 e6 4.e3 Nf6 5.Bd3 Nc6 6.O-O Bd6 7.b3 O-O 8.Bb2 b6 9.Nbd2 Bb7 10.Rc1 Qe7 11.cxd5 exd5 12.Nh4 g6 13.Nhf3 Rad8 14.dxc5 bxc5 15.Bb5 Ne4 16.Bxc6 Bxc6 17.Qc2 Nxd2 18.Nxd2 d4 19.exd4 Bxh2+ 20.Kxh2 Qh4+ 21.Kg1 Bxg2 22.f3 Rfe8 23.Ne4 Qh1+ 24.Kf2 Bxf1 25.d5 f5 26.Qc3 Qg2+ 27.Ke3 Rxe4+ 28.fxe4 f4+ 29.Kxf4 Rf8+ 30.Ke5 Qh2+ 31.Ke6 Re8+ 32.Kd7 Bb5+ 0-1 

[Event "?"]
[Site "New York"]
[Date "1918.??.??"]
[Round "?"]
[White "Capablanca,J"]
[Black "Marshall,F"]
[Result "1-0"] 

1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d5 9.exd5 Nxd5 10.Nxe5 Nxe5 11.Rxe5 Nf6 12.Re1 Bd6 13.h3 Ng4 14.Qf3 Qh4 15.d4 Nxf2 16.Re2 Bg4 17.hxg4 Bh2+ 18.Kf1 Bg3 19.Rxf2 Qh1+ 20.Ke2 Bxf2 21.Bd2 Bh4 22.Qh3 Rae8+ 23.Kd3 Qf1+ 24.Kc2 Bf2 25.Qf3 Qg1 26.Bd5 c5 27.dxc5 Bxc5 28.b4 Bd6 29.a4 a5 30.axb5 axb4 31.Ra6 bxc3 32.Nxc3 Bb4 33.b6 Bxc3 34.Bxc3 h6 35.b7 Re3 36.Bxf7+ Rxf7 37.b8=Q+ Kh7 38.Rxh6+ 1-0 

[Event "?"]
[Site "Hastings"]
[Date "1922.??.??"]
[Round "?"]
[White "Bogoljubow,J"]
[Black "Alekhine,A"]
[Result "0-1"] 

1.d4 f5 2.c4 Nf6 3.g3 e6 4.Bg2 Bb4+ 5.Bd2 Bxd2+ 6.Nxd2 Nc6 7.Ngf3 O-O 8.O-O d6 9.Qb3 Kh8 10.Qc3 e5 11.e3 a5 12.b3 Qe8 13.a3 Qh5 14.h4 Ng4 15.Ng5 Bd7 16.f3 Nf6 17.f4 e4 18.Rfd1 h6 19.Nh3 d5 20.Nf1 Ne7 21.a4 Nc6 22.Rd2 Nb4 23.Bh1 Qe8 24.Rg2 dxc4 25.bxc4 Bxa4 26.Nf2 Bd7 27.Nd2 b5 28.Nd1 Nd3 29.Rxa5 b4 30.Rxa8 bxc3 31.Rxe8 c2 32.Rxf8+ Kh7 33.Nf2 c1=Q+ 34.Nf1 Ne1 35.Rh2 Qxc4 36.Rb8 Bb5 37.Rxb5 Qxb5 38.g4 Nf3+ 39.Bxf3 exf3 40.gxf5 Qe2 41.d5 Kg8 42.h5 Kh7 43.e4 Nxe4 44.Nxe4 Qxe4 45.d6 cxd6 46.f6 gxf6 47.Rd2 Qe2 48.Rxe2 fxe2 49.Kf2 exf1=Q+ 50.Kxf1 Kg7 51.Kf2 Kf7 52.Ke3 Ke6 53.Ke4 d5+ 0-1 

[Event "?"]
[Site "Copenhagen"]
[Date "1923.??.??"]
[Round "?"]
[White "Saemisch,F"]
[Black "Nimzovitch,A"]
[Result "0-1"] 

1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Bb7 5.Bg2 Be7 6.Nc3 O-O 7.O-O d5 8.Ne5 c6 9.cxd5 cxd5 10.Bf4 a6 11.Rc1 b5 12.Qb3 Nc6 13.Nxc6 Bxc6 14.h3 Qd7 15.Kh2 Nh5 16.Bd2 f5 17.Qd1 b4 18.Nb1 Bb5 19.Rg1 Bd6 20.e4 fxe4 21.Qxh5 Rxf2 22.Qg5 Raf8 23.Kh1 R8f5 24.Qe3 Bd3 25.Rce1 h6 0-1 

[Event "?"]
[Site "New York"]
[Date "1924.??.??"]
[Round "?"]
[White "Reti,R"]
[Black "Lasker,Em"]
[Result "0-1"] 

1.Nf3 d5 2.c4 c6 3.b3 Bf5 4.g3 Nf6 5.Bg2 Nbd7 6.Bb2 e6 7.O-O Bd6 8.d3 O-O 9.Nbd2 e5 10.cxd5 cxd5 11.Rc1 Qe7 12.Rc2 a5 13.a4 h6 14.Qa1 Rfe8 15.Rfc1 Bh7 16.Nf1 Nc5 17.Rxc5 Bxc5 18.Nxe5 Rac8 19.Ne3 Qe6 20.h3 Bd6 21.Rxc8 Rxc8 22.Nf3 Be7 23.Nd4 Qd7 24.Kh2 h5 25.Qh1 h4 26.Nxd5 hxg3+ 27.fxg3 Nxd5 28.Bxd5 Bf6 29.Bxb7 Rc5 30.Ba6 Bg6 31.Qb7 Qd8 32.b4 Rc7 33.Qb6 Rd7 34.Qxd8+ Rxd8 35.e3 axb4 36.Kg2 Bxd4 37.exd4 Bf5 38.Bb7 Be6 39.Kf3 Bb3 40.Bc6 Rd6 41.Bb5 Rf6+ 42.Ke3 Re6+ 43.Kf4 Re2 44.Bc1 Rc2 45.Be3 Bd5 0-1 

[Event "?"]
[Site "Baden-Baden"]
[Date "1925.??.??"]
[Round "?"]
[White "Reti,R"]
[Black "Alekhine,A"]
[Result "0-1"] 

1.g3 e5 2.Nf3 e4 3.Nd4 d5 4.d3 exd3 5.Qxd3 Nf6 6.Bg2 Bb4+ 7.Bd2 Bxd2+ 8.Nxd2 O-O 9.c4 Na6 10.cxd5 Nb4 11.Qc4 Nbxd5 12.N2b3 c6 13.O-O Re8 14.Rfd1 Bg4 15.Rd2 Qc8 16.Nc5 Bh3 17.Bf3 Bg4 18.Bg2 Bh3 19.Bf3 Bg4 20.Bh1 h5 21.b4 a6 22.Rc1 h4 23.a4 hxg3 24.hxg3 Qc7 25.b5 axb5 26.axb5 Re3 27.Nf3 cxb5 28.Qxb5 Nc3 29.Qxb7 Qxb7 30.Nxb7 Nxe2+ 31.Kh2 Ne4 32.Rc4 Nxf2 33.Bg2 Be6 34.Rcc2 Ng4+ 35.Kh3 Ne5+ 36.Kh2 Rxf3 37.Rxe2 Ng4+ 38.Kh3 Ne3+ 39.Kh2 Nxc2 40.Bxf3 Nd4 41.Rf2 Nxf3+ 42.Rxf3 Bd5 0-1 

[Event "?"]
[Site "Dresden"]
[Date "1926.??.??"]
[Round "?"]
[White "Johner,P"]
[Black "Nimzovitch,A"]
[Result "0-1"] 

1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 O-O 5.Bd3 c5 6.Nf3 Nc6 7.O-O Bxc3 8.bxc3 d6 9.Nd2 b6 10.Nb3 e5 11.f4 e4 12.Be2 Qd7 13.h3 Ne7 14.Qe1 h5 15.Bd2 Qf5 16.Kh2 Qh7 17.a4 Nf5 18.g3 a5 19.Rg1 Nh6 20.Bf1 Bd7 21.Bc1 Rac8 22.d5 Kh8 23.Nd2 Rg8 24.Bg2 g5 25.Nf1 Rg7 26.Ra2 Nf5 27.Bh1 Rcg8 28.Qd1 gxf4 29.exf4 Bc8 30.Qb3 Ba6 31.Re2 Nh4 32.Re3 Bc8 33.Qc2 Bxh3 34.Bxe4 Bf5 35.Bxf5 Nxf5 36.Re2 h4 37.Rgg2 hxg3+ 38.Kg1 Qh3 39.Ne3 Nh4 40.Kf1 Re8 0-1 

[Event "?"]
[Site "New York"]
[Date "1927.??.??"]
[Round "?"]
[White "Nimzovitch,A"]
[Black "Capablanca,J"]
[Result "0-1"] 

1.e4 c6 2.d4 d5 3.e5 Bf5 4.Bd3 Bxd3 5.Qxd3 e6 6.Nc3 Qb6 7.Nge2 c5 8.dxc5 Bxc5 9.O-O Ne7 10.Na4 Qc6 11.Nxc5 Qxc5 12.Be3 Qc7 13.f4 Nf5 14.c3 Nc6 15.Rad1 g6 16.g4 Nxe3 17.Qxe3 h5 18.g5 O-O 19.Nd4 Qb6 20.Rf2 Rfc8 21.a3 Rc7 22.Rd3 Na5 23.Re2 Re8 24.Kg2 Nc6 25.Red2 Rec8 26.Re2 Ne7 27.Red2 Rc4 28.Qh3 Kg7 29.Rf2 a5 30.Re2 Nf5 31.Nxf5+ gxf5 32.Qf3 Kg6 33.Red2 Re4 34.Rd4 Rc4 35.Qf2 Qb5 36.Kg3 Rcxd4 37.cxd4 Qc4 38.Kg2 b5 39.Kg1 b4 40.axb4 axb4 41.Kg2 Qc1 42.Kg3 Qh1 43.Rd3 Re1 44.Rf3 Rd1 45.b3 Rc1 46.Re3 Rf1 0-1 

[Event "WCh"]
[Site "Buenos Aires"]
[Date "1927.??.??"]
[Round "21"]
[White "Capablanca,J"]
[Black "Alekhine,A"]
[Result "0-1"] 

1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.e3 Be7 6.Nf3 O-O 7.Rc1 a6 8.a3 h6 9.Bh4 dxc4 10.Bxc4 b5 11.Be2 Bb7 12.O-O c5 13.dxc5 Nxc5 14.Nd4 Rc8 15.b4 Ncd7 16.Bg3 Nb6 17.Qb3 Nfd5 18.Bf3 Rc4 19.Ne4 Qc8 20.Rxc4 Nxc4 21.Rc1 Qa8 22.Nc3 Rc8 23.Nxd5 Bxd5 24.Bxd5 Qxd5 25.a4 Bf6 26.Nf3 Bb2 27.Re1 Rd8 28.axb5 axb5 29.h3 e5 30.Rb1 e4 31.Nd4 Bxd4 32.Rd1 Nxe3 0-1 

[Event "?"]
[Site "Karlsbad"]
[Date "1929.??.??"]
[Round "?"]
[White "Capablanca,J"]
[Black "Treybal,K"]
[Result "1-0"] 

1.d4 d5 2.c4 c6 3.Nf3 e6 4.Bg5 Be7 5.Bxe7 Qxe7 6.Nbd2 f5 7.e3 Nd7 8.Bd3 Nh6 9.O-O O-O 10.Qc2 g6 11.Rab1 Nf6 12.Ne5 Nf7 13.f4 Bd7 14.Ndf3 Rfd8 15.b4 Be8 16.Rfc1 a6 17.Qf2 Nxe5 18.Nxe5 Nd7 19.Nf3 Rdc8 20.c5 Nf6 21.a4 Ng4 22.Qe1 Nh6 23.h3 Nf7 24.g4 Bd7 25.Rc2 Kh8 26.Rg2 Rg8 27.g5 Qd8 28.h4 Kg7 29.h5 Rh8 30.Rh2 Qc7 31.Qc3 Qd8 32.Kf2 Qc7 33.Rbh1 Rag8 34.Qa1 Rb8 35.Qa3 Rbg8 36.b5 axb5 37.h6+ Kf8 38.axb5 Ke7 39.b6 Qb8 40.Ra1 Rc8 41.Qb4 Rhd8 42.Ra7 Kf8 43.Rh1 Be8 44.Rha1 Kg8 45.R1a4 Kf8 46.Qa3 Kg8 47.Kg3 Bd7 48.Kh4 Kh8 49.Qa1 Kg8 50.Kg3 Kf8 51.Kg2 Be8 52.Nd2 Bd7 53.Nb3 Re8 54.Na5 Nd8 55.Ba6 bxa6 56.Rxd7 Re7 57.Rxd8+ Rxd8 58.Nxc6 1-0 

[Event "WCh"]
[Site "GER\NLD"]
[Date "1929.??.??"]
[Round "18"]
[White "Bogoljubow,E"]
[Black "Alekhine,A"]
[Result "1-0"] 

1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.Bg5 dxe4 5.Nxe4 Be7 6.Bxf6 gxf6 7.Nf3 f5 8.Nc3 c6 9.g3 Nd7 10.Bg2 Qc7 11.Qe2 b5 12.Ne5 Bb7 13.O-O-O Nb6 14.Qh5 Rf8 15.f4 b4 16.Ne2 Nd5 17.Bxd5 cxd5 18.Kb1 a5 19.g4 fxg4 20.f5 exf5 21.Qxf5 a4 22.Rhe1 a3 23.b3 Bc8 24.Qxh7 Be6 25.Qd3 O-O-O 26.c3 Kb7 27.Rc1 Qb6 28.cxb4 Bxb4 29.Rc6 Qa5 30.Rec1 Rc8 31.Nf4 Bd6 32.Nxe6 fxe6 33.Qh7+ Rc7 34.Rxc7+ Bxc7 35.Qd7 Qb6 36.Nd3 Rd8 37.Rxc7+ Qxc7 38.Nc5+ Kb6 39.Qxc7+ Kxc7 40.Nxe6+ Kd7 41.Nxd8 Kxd8 42.b4 Kd7 43.Kc2 Kc6 44.Kb3 Kb5 45.Kxa3 Kc4 46.b5 Kxb5 47.Kb3 Ka5 48.a4 Ka6 49.Kb4 Kb6 50.a5+ Kc6 51.Ka4 1-0 

[Event "WCh"]
[Site "NLD"]
[Date "1935.??.??"]
[Round "26"]
[White "Euwe,M"]
[Black "Alekhine,A"]
[Result "1-0"] 

1.d4 e6 2.c4 f5 3.g3 Bb4+ 4.Bd2 Be7 5.Bg2 Nf6 6.Nc3 O-O 7.Nf3 Ne4 8.O-O b6 9.Qc2 Bb7 10.Ne5 Nxc3 11.Bxc3 Bxg2 12.Kxg2 Qc8 13.d5 d6 14.Nd3 e5 15.Kh1 c6 16.Qb3 Kh8 17.f4 e4 18.Nb4 c5 19.Nc2 Nd7 20.Ne3 Bf6 21.Nxf5 Bxc3 22.Nxd6 Qb8 23.Nxe4 Bf6 24.Nd2 g5 25.e4 gxf4 26.gxf4 Bd4 27.e5 Qe8 28.e6 Rg8 29.Nf3 Qg6 30.Rg1 Bxg1 31.Rxg1 Qf6 32.Ng5 Rg7 33.exd7 Rxd7 34.Qe3 Re7 35.Ne6 Rf8 36.Qe5 Qxe5 37.fxe5 Rf5 38.Re1 h6 39.Nd8 Rf2 40.e6 Rd2 41.Nc6 Re8 42.e7 b5 43.Nd8 Kg7 44.Nb7 Kf6 45.Re6+ Kg5 46.Nd6 Rxe7 47.Ne4+ 1-0 

[Event "?"]
[Site "Nottingham"]
[Date "1936.??.??"]
[Round "?"]
[White "Botvinnik,M"]
[Black "Tartakower,S"]
[Result "1-0"] 

1.Nf3 Nf6 2.c4 d6 3.d4 Nbd7 4.g3 e5 5.Bg2 Be7 6.O-O O-O 7.Nc3 c6 8.e4 Qc7 9.h3 Re8 10.Be3 Nf8 11.Rc1 h6 12.d5 Bd7 13.Nd2 g5 14.f4 gxf4 15.gxf4 Kg7 16.fxe5 dxe5 17.c5 cxd5 18.Nxd5 Qc6 19.Nc4 Ng6 20.Nd6 Be6 21.Nxe7 Nxe7 22.Rxf6 Kxf6 23.Qh5 Ng6 24.Nf5 Rg8 25.Qxh6 Bxa2 26.Rd1 Rad8 27.Qg5+ Ke6 28.Rxd8 f6 29.Rxg8 Nf4 30.Qg7 1-0 

[Event "?"]
[Site "Semmering"]
[Date "1937.??.??"]
[Round "?"]
[White "Reshevsky,S"]
[Black "Keres,P"]
[Result "0-1"] 

1.Nf3 Nf6 2.d4 e6 3.c4 b6 4.g3 Bb7 5.Bg2 Bb4+ 6.Bd2 Bxd2+ 7.Qxd2 O-O 8.O-O d6 9.Qc2 Nbd7 10.Nc3 Qe7 11.e4 Rac8 12.Rfe1 e5 13.Rad1 c6 14.Qa4 Rc7 15.Qa3 Re8 16.b3 g6 17.dxe5 dxe5 18.Qxe7 Rxe7 19.Bh3 Bc8 20.b4 Nf8 21.Bxc8 Rxc8 22.Rd6 Ne8 23.Rd3 f6 24.Red1 Kf7 25.a4 Ke6 26.Rd8 Rec7 27.Kf1 Ke7 28.R8d3 Rd7 29.Rxd7+ Nxd7 30.Ke2 Nd6 31.Nd2 Nf8 32.Ra1 Ne6 33.a5 b5 34.cxb5 Nd4+ 35.Kd3 cxb5 36.Rc1 Ke6 37.Ne2 Nc6 38.Rb1 Rd8 39.Kc3 f5 40.exf5+ gxf5 41.f3 Rc8 42.Kd3 Ne8 43.Nc3 Nf6 44.Rb2 a6 45.g4 e4+ 46.fxe4 Ne5+ 47.Kc2 fxg4 48.Kb3 Nc4 49.Nxc4 Rxc4 50.Re2 Ke5 51.Re1 h5 52.Rd1 h4 53.Rd8 g3 54.hxg3 hxg3 55.Rd3 g2 56.Ne2 Rxe4 57.Ng1 Re1 0-1 

[Event "AVRO"]
[Site "?"]
[Date "1938.??.??"]
[Round "?"]
[White "Botvinnik,M"]
[Black "Capablanca,J"]
[Result "1-0"] 

1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.e3 d5 5.a3 Bxc3+ 6.bxc3 c5 7.cxd5 exd5 8.Bd3 O-O 9.Ne2 b6 10.O-O Ba6 11.Bxa6 Nxa6 12.Bb2 Qd7 13.a4 Rfe8 14.Qd3 c4 15.Qc2 Nb8 16.Rae1 Nc6 17.Ng3 Na5 18.f3 Nb3 19.e4 Qxa4 20.e5 Nd7 21.Qf2 g6 22.f4 f5 23.exf6 Nxf6 24.f5 Rxe1 25.Rxe1 Re8 26.Re6 Rxe6 27.fxe6 Kg7 28.Qf4 Qe8 29.Qe5 Qe7 30.Ba3 Qxa3 31.Nh5+ gxh5 32.Qg5+ Kf8 33.Qxf6+ Kg8 34.e7 Qc1+ 35.Kf2 Qc2+ 36.Kg3 Qd3+ 37.Kh4 Qe4+ 38.Kxh5 Qe2+ 39.Kh4 Qe4+ 40.g4 Qe1+ 41.Kh5 1-0 

[Event "m"]
[Site "Rotterdam"]
[Date "1940.??.??"]
[Round "9"]
[White "Euwe,M"]
[Black "Keres,P"]
[Result "0-1"] 

1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.g3 Bb7 5.Bg2 Be7 6.O-O O-O 7.Nc3 Ne4 8.Qc2 Nxc3 9.Qxc3 d6 10.Qc2 f5 11.Ne1 Qc8 12.e4 Nd7 13.d5 fxe4 14.Qxe4 Nc5 15.Qe2 Bf6 16.Bh3 Re8 17.Be3 Qd8 18.Bxc5 exd5 19.Be6+ Kh8 20.Rd1 dxc5 21.Ng2 d4 22.f4 d3 23.Rxd3 Qxd3 24.Qxd3 Bd4+ 25.Rf2 Rxe6 26.Kf1 Rae8 27.f5 Re5 28.f6 gxf6 29.Rd2 Bc8 30.Nf4 Re3 31.Qb1 Rf3+ 32.Kg2 Rxf4 33.gxf4 Rg8+ 34.Kf3 Bg4+ 0-1 

[Event "ch"]
[Site "URS"]
[Date "1941.??.??"]
[Round "?"]
[White "Keres,P"]
[Black "Botvinnik,M"]
[Result "0-1"] 

1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2 d5 5.cxd5 exd5 6.Bg5 h6 7.Bh4 c5 8.O-O-O Bxc3 9.Qxc3 g5 10.Bg3 cxd4 11.Qxd4 Nc6 12.Qa4 Bf5 13.e3 Rc8 14.Bd3 Qd7 15.Kb1 Bxd3+ 16.Rxd3 Qf5 17.e4 Nxe4 18.Ka1 O-O 19.Rd1 b5 20.Qxb5 Nd4 21.Qd3 Nc2+ 22.Kb1 Nb4 0-1 

[Event "URS USA"]
[Site "?"]
[Date "1946.??.??"]
[Round "?"]
[White "Smyslov,V"]
[Black "Reshevsky,S"]
[Result "1-0"] 

1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Nxe4 6.d4 b5 7.Bb3 d5 8.dxe5 Be6 9.c3 Bc5 10.Nbd2 O-O 11.Bc2 f5 12.Nb3 Bb6 13.Nfd4 Nxd4 14.Nxd4 Bxd4 15.cxd4 f4 16.f3 Ng3 17.hxg3 fxg3 18.Qd3 Bf5 19.Qxf5 Rxf5 20.Bxf5 Qh4 21.Bh3 Qxd4+ 22.Kh1 Qxe5 23.Bd2 Qxb2 24.Bf4 c5 25.Be6+ Kh8 26.Bxd5 Rd8 27.Rad1 c4 28.Bxg3 c3 29.Be5 b4 30.Bb3 Rd2 31.f4 h5 32.Rb1 Rf2 33.Rfe1 Qd2 34.Rbd1 Qb2 35.Rd8+ Kh7 36.Bg8+ Kg6 37.Rd6+ Kf5 38.Be6+ Kg6 39.Bd5+ Kh7 40.Be4+ Kg8 41.Bg6 1-0 

[Event "WCh"]
[Site "Moscow"]
[Date "1951.??.??"]
[Round "23"]
[White "Botvinnik,M"]
[Black "Bronstein,D"]
[Result "1-0"] 

1.d4 Nf6 2.c4 g6 3.g3 c6 4.Bg2 d5 5.cxd5 cxd5 6.Nc3 Bg7 7.Nh3 Bxh3 8.Bxh3 Nc6 9.Bg2 e6 10.e3 O-O 11.Bd2 Rc8 12.O-O Nd7 13.Ne2 Qb6 14.Bc3 Rfd8 15.Nf4 Nf6 16.Qb3 Ne4 17.Qxb6 axb6 18.Be1 Na5 19.Nd3 Bf8 20.f3 Nd6 21.Bf2 Bh6 22.Rac1 Nac4 23.Rfe1 Na5 24.Kf1 Bg7 25.g4 Nc6 26.b3 Nb5 27.Ke2 Bf8 28.a4 Nc7 29.Bg3 Na6 30.Bf1 f6 31.Red1 Na5 32.Rxc8 Rxc8 33.Rc1 Rxc1 34.Nxc1 Ba3 35.Kd1 Bxc1 36.Kxc1 Nxb3+ 37.Kc2 Na5 38.Kc3 Kf7 39.e4 f5 40.gxf5 gxf5 41.Bd3 Kg6 42.Bd6 Nc6 43.Bb1 Kf6 44.Bg3 fxe4 45.fxe4 h6 46.Bf4 h5 47.exd5 exd5 48.h4 Nab8 49.Bg5+ Kf7 50.Bf5 Na7 51.Bf4 Nbc6 52.Bd3 Nc8 53.Be2 Kg6 54.Bd3+ Kf6 55.Be2 Kg6 56.Bf3 N6e7 57.Bg5 1-0 

[Event "ct"]
[Site "SWZ"]
[Date "1953.??.??"]
[Round "?"]
[White "Averbakh,Y"]
[Black "Kotov,A"]
[Result "0-1"] 

1.d4 Nf6 2.c4 d6 3.Nf3 Nbd7 4.Nc3 e5 5.e4 Be7 6.Be2 O-O 7.O-O c6 8.Qc2 Re8 9.Rd1 Bf8 10.Rb1 a5 11.d5 Nc5 12.Be3 Qc7 13.h3 Bd7 14.Rbc1 g6 15.Nd2 Rab8 16.Nb3 Nxb3 17.Qxb3 c5 18.Kh2 Kh8 19.Qc2 Ng8 20.Bg4 Nh6 21.Bxd7 Qxd7 22.Qd2 Ng8 23.g4 f5 24.f3 Be7 25.Rg1 Rf8 26.Rcf1 Rf7 27.gxf5 gxf5 28.Rg2 f4 29.Bf2 Rf6 30.Ne2 Qxh3+ 31.Kxh3 Rh6+ 32.Kg4 Nf6+ 33.Kf5 Nd7 34.Rg5 Rf8+ 35.Kg4 Nf6+ 36.Kf5 Ng8+ 37.Kg4 Nf6+ 38.Kf5 Nxd5+ 39.Kg4 Nf6+ 40.Kf5 Ng8+ 41.Kg4 Nf6+ 42.Kf5 Ng8+ 43.Kg4 Bxg5 44.Kxg5 Rf7 45.Bh4 Rg6+ 46.Kh5 Rfg7 47.Bg5 Rxg5+ 48.Kh4 Nf6 49.Ng3 Rxg3 50.Qxd6 R3g6 51.Qb8+ Rg8 0-1 

[Event "WCh"]
[Site "Moscow"]
[Date "1954.??.??"]
[Round "14"]
[White "Botvinnik,M"]
[Black "Smyslov,V"]
[Result "0-1"] 

1.d4 Nf6 2.c4 g6 3.g3 Bg7 4.Bg2 O-O 5.Nc3 d6 6.Nf3 Nbd7 7.O-O e5 8.e4 c6 9.Be3 Ng4 10.Bg5 Qb6 11.h3 exd4 12.Na4 Qa6 13.hxg4 b5 14.Nxd4 bxa4 15.Nxc6 Qxc6 16.e5 Qxc4 17.Bxa8 Nxe5 18.Rc1 Qb4 19.a3 Qxb2 20.Qxa4 Bb7 21.Rb1 Nf3+ 22.Kh1 Bxa8 23.Rxb2 Nxg5+ 24.Kh2 Nf3+ 25.Kh3 Bxb2 26.Qxa7 Be4 27.a4 Kg7 28.Rd1 Be5 29.Qe7 Rc8 30.a5 Rc2 31.Kg2 Nd4+ 32.Kf1 Bf3 33.Rb1 Nc6 0-1 

[Event "ch"]
[Site "USA"]
[Date "1956.??.??"]
[Round "?"]
[White "Byrne,D"]
[Black "Fischer,R"]
[Result "0-1"] 

1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4 7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4 12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3 16.Bc5 Rfe8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+ 20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6 24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2 28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Nf3 Ne4 32.Qb8 b5 33.h4 h5 34.Ne5 Kg7 35.Kg1 Bc5+ 36.Kf1 Ng3+ 37.Ke1 Bb4+ 38.Kd1 Bb3+ 39.Kc1 Ne2+ 40.Kb1 Nc3+ 41.Kc1 Rc2+ 0-1 

[Event "ch"]
[Site "URS"]
[Date "1958.??.??"]
[Round "?"]
[White "Polugaevsky,L"]
[Black "Neshmetdinov,R"]
[Result "0-1"] 

1.d4 Nf6 2.c4 d6 3.e4 e5 4.Nc3 exd4 5.Qxd4 Nc6 6.Qd2 g6 7.b3 Bg7 8.Bb2 O-O 9.Bd3 Ng4 10.Nge2 Qh4 11.Ng3 Nge5 12.O-O f5 13.f3 Bh6 14.Qd1 f4 15.Nge2 g5 16.Nd5 g4 17.g3 fxg3 18.hxg3 Qh3 19.f4 Be6 20.Bc2 Rf7 21.Kf2 Qh2+ 22.Ke3 Bxd5 23.cxd5 Nb4 24.Rh1 Rxf4 25.Rxh2 Rf3+ 26.Kd4 Bg7 27.a4 c5+ 28.dxc6 bxc6 29.Bd3 Nexd3+ 30.Kc4 d5+ 31.exd5 cxd5+ 32.Kb5 Rb8+ 33.Ka5 Nc6+ 0-1 

[Event "ct"]
[Site "JUG"]
[Date "1959.??.??"]
[Round "?"]
[White "Tal,M"]
[Black "Smyslov,V"]
[Result "1-0"] 

1.e4 c6 2.d3 d5 3.Nd2 e5 4.Ngf3 Nd7 5.d4 dxe4 6.Nxe4 exd4 7.Qxd4 Ngf6 8.Bg5 Be7 9.O-O-O O-O 10.Nd6 Qa5 11.Bc4 b5 12.Bd2 Qa6 13.Nf5 Bd8 14.Qh4 bxc4 15.Qg5 Nh5 16.Nh6+ Kh8 17.Qxh5 Qxa2 18.Bc3 Nf6 19.Qxf7 Qa1+ 20.Kd2 Rxf7 21.Nxf7+ Kg8 22.Rxa1 Kxf7 23.Ne5+ Ke6 24.Nxc6 Ne4+ 25.Ke3 Bb6+ 26.Bd4 1-0 

[Event "ch"]
[Site "URS"]
[Date "1959.??.??"]
[Round "?"]
[White "Cholmov,R"]
[Black "Keres,P"]
[Result "1-0"] 

1.e4 c5 2.Nf3 Nc6 3.Bb5 Nf6 4.e5 Ng4 5.Bxc6 dxc6 6.O-O g6 7.Re1 Bg7 8.h3 Nh6 9.Nc3 b6 10.d4 cxd4 11.Nxd4 c5 12.Nc6 Qd7 13.Nxe7 Kxe7 14.Bxh6 Bxh6 15.Qf3 Bg7 16.Nd5+ Kd8 17.Rad1 Bb7 18.Qb3 Bc6 19.Nxb6 axb6 20.Qxf7 Bxe5 21.Rxd7+ Bxd7 22.Rxe5 Kc7 23.Re7 Rad8 24.a4 g5 25.Qd5 Rhe8 26.Rxh7 g4 27.a5 gxh3 28.axb6+ Kxb6 29.Rxd7 1-0 

[Event "ST ol"]
[Site "Marianske Lazne"]
[Date "1962.??.??"]
[Round "?"]
[White "Gufeld,E"]
[Black "Kavalek,L"]
[Result "0-1"] 

1.e4 e5 2.Nf3 Nc6 3.Bb5 Bc5 4.c3 f5 5.d4 fxe4 6.Ng5 Bb6 7.d5 e3 8.Ne4 Qh4 9.Qf3 Nf6 10.Nxf6+ gxf6 11.dxc6 exf2+ 12.Kd1 dxc6 13.Be2 Be6 14.Qh5+ Qxh5 15.Bxh5+ Ke7 16.b3 Bd5 17.Ba3+ Ke6 18.Bg4+ f5 19.Bh3 Rhg8 20.Nd2 Bxg2 21.Bxg2 Rxg2 22.Rf1 Rd8 23.Ke2 Rxd2+ 24.Kxd2 e4 25.Bf8 f4 26.b4 Rg5 27.Bc5 Rxc5 28.bxc5 Bxc5 29.Rab1 f3 30.Rb4 Kf5 31.Rd4 Bxd4 32.cxd4 Kf4 0-1 

[Event "ol"]
[Site "Varna"]
[Date "1962.??.??"]
[Round "?"]
[White "Spassky,B"]
[Black "Evans,L"]
[Result "1-0"] 

1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 c6 6.Be3 a6 7.Qd2 b5 8.O-O-O bxc4 9.Bxc4 O-O 10.h4 d5 11.Bb3 dxe4 12.h5 exf3 13.hxg6 hxg6 14.Bh6 fxg2 15.Rh4 Ng4 16.Bxg7 Kxg7 17.Qxg2 Nh6 18.Nf3 Nf5 19.Rh2 Qd6 20.Ne5 Nd7 21.Ne4 Qc7 22.Rdh1 Rg8 23.Rh7+ Kf8 24.Rxf7+ Ke8 25.Qxg6 Nxe5 26.Rf8+ 1-0 

[Event "ch"]
[Site "USA"]
[Date "1963.??.??"]
[Round "?"]
[White "Byrne,R"]
[Black "Fischer,R"]
[Result "0-1"] 

1.d4 Nf6 2.c4 g6 3.g3 c6 4.Bg2 d5 5.cxd5 cxd5 6.Nc3 Bg7 7.e3 O-O 8.Nge2 Nc6 9.O-O b6 10.b3 Ba6 11.Ba3 Re8 12.Qd2 e5 13.dxe5 Nxe5 14.Rfd1 Nd3 15.Qc2 Nxf2 16.Kxf2 Ng4+ 17.Kg1 Nxe3 18.Qd2 Nxg2 19.Kxg2 d4 20.Nxd4 Bb7+ 21.Kf1 Qd7 0-1 

[Event "cq"]
[Site "Riga"]
[Date "1965.??.??"]
[Round "10"]
[White "Keres,P"]
[Black "Spassky,B"]
[Result "0-1"] 

1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f4 c5 6.d5 O-O 7.Nf3 e6 8.Be2 exd5 9.cxd5 b5 10.e5 dxe5 11.fxe5 Ng4 12.Bf4 Nd7 13.e6 fxe6 14.dxe6 Rxf4 15.Qd5 Kh8 16.Qxa8 Nb6 17.Qxa7 Bxe6 18.O-O Ne3 19.Rf2 b4 20.Nb5 Rf7 21.Qa5 Qb8 22.Re1 Bd5 23.Bf1 Nxf1 24.Rfxf1 Nc4 25.Qa6 Rf6 26.Qa4 Nxb2 27.Qc2 Qxb5 28.Re7 Nd3 29.Qe2 c4 30.Re8+ Rf8 31.Rxf8+ Bxf8 32.Ng5 Bc5+ 33.Kh1 Qd7 34.Qd2 Qe7 35.Nf3 Qe3 0-1 

[Event "cs"]
[Site "Bled"]
[Date "1965"]
[Round "10"]
[White "Tal,M"]
[Black "Larsen,B"]
[Result "1-0"] 

1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 e6 5.Nc3 d6 6.Be3 Nf6 7.f4 Be7 8.Qf3 O-O 9.O-O-O Qc7 10.Ndb5 Qb8 11.g4 a6 12.Nd4 Nxd4 13.Bxd4 b5 14.g5 Nd7 15.Bd3 b4 16.Nd5 exd5 17.exd5 f5 18.Rhe1 Rf7 19.h4 Bb7 20.Bxf5 Rxf5 21.Rxe7 Ne5 22.Qe4 Qf8 23.fxe5 Rf4 24.Qe3 Rf3 25.Qe2 Qxe7 26.Qxf3 dxe5 27.Re1 Rd8 28.Rxe5 Qd6 29.Qf4 Rf8 30.Qe4 b3 31.axb3 Rf1+ 32.Kd2 Qb4+ 33.c3 Qd6 34.Bc5 Qxc5 35.Re8+ Rf8 36.Qe6+ Kh8 37.Qf7 1-0 

[Event "?"]
[Site "Monte Carlo"]
[Date "1968.??.??"]
[Round "?"]
[White "Botvinnik,M"]
[Black "Portisch,L"]
[Result "1-0"] 

1.c4 e5 2.Nc3 Nf6 3.g3 d5 4.cxd5 Nxd5 5.Bg2 Be6 6.Nf3 Nc6 7.O-O Nb6 8.d3 Be7 9.a3 a5 10.Be3 O-O 11.Na4 Nxa4 12.Qxa4 Bd5 13.Rfc1 Re8 14.Rc2 Bf8 15.Rac1 Nb8 16.Rxc7 Bc6 17.R1xc6 bxc6 18.Rxf7 h6 19.Rb7 Qc8 20.Qc4+ Kh8 21.Nh4 Qxb7 22.Ng6+ Kh7 23.Be4 Bd6 24.Nxe5+ g6 25.Bxg6+ Kg7 26.Bxh6+ 1-0 

[Event "WCh"]
[Site "Moscow"]
[Date "1969.??.??"]
[Round "19"]
[White "Spassky,B"]
[Black "Petrosian,T"]
[Result "1-0"] 

1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 Nbd7 7.Bc4 Qa5 8.Qd2 h6 9.Bxf6 Nxf6 10.O-O-O e6 11.Rhe1 Be7 12.f4 O-O 13.Bb3 Re8 14.Kb1 Bf8 15.g4 Nxg4 16.Qg2 Nf6 17.Rg1 Bd7 18.f5 Kh8 19.Rdf1 Qd8 20.fxe6 fxe6 21.e5 dxe5 22.Ne4 Nh5 23.Qg6 exd4 24.Ng5 1-0 

[Event "URS-WORLD"]
[Site "Belgrade"]
[Date "1970"]
[Round "?"]
[White "Larsen,B"]
[Black "Spassky,B"]
[Result "0-1"] 

1.b3 e5 2.Bb2 Nc6 3.c4 Nf6 4.Nf3 e4 5.Nd4 Bc5 6.Nxc6 dxc6 7.e3 Bf5 8.Qc2 Qe7 9.Be2 O-O-O 10.f4 Ng4 11.g3 h5 12.h3 h4 13.hxg4 hxg3 14.Rg1 Rh1 15.Rxh1 g2 16.Rf1 Qh4+ 17.Kd1 gxf1=Q+ 0-1 

[Event "WCh"]
[Site "Reykjavik"]
[Date "1972.??.??"]
[Round "6"]
[White "Fischer,R"]
[Black "Spassky,B"]
[Result "1-0"] 

1.c4 e6 2.Nf3 d5 3.d4 Nf6 4.Nc3 Be7 5.Bg5 O-O 6.e3 h6 7.Bh4 b6 8.cxd5 Nxd5 9.Bxe7 Qxe7 10.Nxd5 exd5 11.Rc1 Be6 12.Qa4 c5 13.Qa3 Rc8 14.Bb5 a6 15.dxc5 bxc5 16.O-O Ra7 17.Be2 Nd7 18.Nd4 Qf8 19.Nxe6 fxe6 20.e4 d4 21.f4 Qe7 22.e5 Rb8 23.Bc4 Kh8 24.Qh3 Nf8 25.b3 a5 26.f5 exf5 27.Rxf5 Nh7 28.Rcf1 Qd8 29.Qg3 Re7 30.h4 Rbb7 31.e6 Rbc7 32.Qe5 Qe8 33.a4 Qd8 34.R1f2 Qe8 35.R2f3 Qd8 36.Bd3 Qe8 37.Qe4 Nf6 38.Rxf6 gxf6 39.Rxf6 Kg8 40.Bc4 Kh8 41.Qf4 1-0 

[Event "izt"]
[Site "Petropolis"]
[Date "1973.??.??"]
[Round "?"]
[White "Bronstein,D"]
[Black "Ljubojevic,L"]
[Result "1-0"] 

1.e4 Nf6 2.e5 Nd5 3.d4 d6 4.c4 Nb6 5.f4 dxe5 6.fxe5 c5 7.d5 e6 8.Nc3 exd5 9.cxd5 c4 10.Nf3 Bg4 11.Qd4 Bxf3 12.gxf3 Bb4 13.Bxc4 O-O 14.Rg1 g6 15.Bg5 Qc7 16.Bb3 Bc5 17.Qf4 Bxg1 18.d6 Qc8 19.Ke2 Bc5 20.Ne4 N8d7 21.Rc1 Qc6 22.Rxc5 Nxc5 23.Nf6+ Kh8 24.Qh4 Qb5+ 25.Ke3 h5 26.Nxh5 Qxb3+ 27.axb3 Nd5+ 28.Kd4 Ne6+ 29.Kxd5 Nxg5 30.Nf6+ Kg7 31.Qxg5 Rfc8 32.e6 fxe6+ 33.Kxe6 Rf8 34.d7 a5 35.Ng4 Ra6+ 36.Ke5 Rf5+ 37.Qxf5 gxf5 38.d8=Q fxg4 39.Qd7+ Kh6 40.Qxb7 Rg6 41.f4 1-0 

[Event "cf (WCh)"]
[Site "Moscow"]
[Date "1974.??.??"]
[Round "2"]
[White "Karpov,A"]
[Black "Korchnoi,V"]
[Result "1-0"] 

1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 6.Be3 Bg7 7.f3 Nc6 8.Qd2 O-O 9.Bc4 Bd7 10.h4 Rc8 11.Bb3 Ne5 12.O-O-O Nc4 13.Bxc4 Rxc4 14.h5 Nxh5 15.g4 Nf6 16.Nde2 Qa5 17.Bh6 Bxh6 18.Qxh6 Rfc8 19.Rd3 R4c5 20.g5 Rxg5 21.Rd5 Rxd5 22.Nxd5 Re8 23.Nef4 Bc6 24.e5 Bxd5 25.exf6 exf6 26.Qxh7+ Kf8 27.Qh8+ 1-0 

[Event "ch"]
[Site "URS"]
[Date "1976.??.??"]
[Round "?"]
[White "Geller,E"]
[Black "Karpov,A"]
[Result "1-0"] 

1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 Qd7 5.Nf3 b6 6.Bd2 Ba6 7.Bxa6 Nxa6 8.O-O Nb8 9.Ne2 Be7 10.Rc1 b5 11.Nf4 h5 12.b3 Ba3 13.Rb1 a5 14.c4 c6 15.c5 Bb4 16.Bc1 a4 17.Nd3 Ba5 18.bxa4 bxa4 19.Qxa4 Qa7 20.Bg5 Bc7 21.Rxb8+ Qxb8 22.Qxc6+ Kf8 23.Nf4 Ra7 24.Nh4 Qe8 25.Qxe6 fxe6 26.Nhg6+ Qxg6 27.Nxg6+ Ke8 28.Nxh8 Ra4 29.Rd1 Ne7 30.Bxe7 Kxe7 31.Ng6+ Kf7 32.Nf4 Bxe5 33.dxe5 Rxf4 34.Rc1 Ke8 35.c6 Kd8 36.c7+ Kc8 37.g3 Ra4 38.Rc6 Rxa2 39.Rxe6 g5 40.Rd6 Rd2 41.e6 Kxc7 42.e7 1-0 

[Event "EU-TC"]
[Site "Skara"]
[Date "1980.??.??"]
[Round "?"]
[White "Kasparov,G"]
[Black "Pribyl,J"]
[Result "1-0"] 

1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5 Nxd5 5.e4 Nxc3 6.bxc3 Bg7 7.Nf3 b6 8.Bb5+ c6 9.Bc4 O-O 10.O-O Ba6 11.Bxa6 Nxa6 12.Qa4 Qc8 13.Bg5 Qb7 14.Rfe1 e6 15.Rab1 c5 16.d5 Bxc3 17.Red1 exd5 18.exd5 Bg7 19.d6 f6 20.d7 fxg5 21.Qc4+ Kh8 22.Nxg5 Bf6 23.Ne6 Nc7 24.Nxf8 Rxf8 25.Rd6 Be7 26.d8=Q Bxd8 27.Qc3+ Kg8 28.Rd7 Bf6 29.Qc4+ Kh8 30.Qf4 Qa6 31.Qh6 1-0 

[Event "?"]
[Site "London"]
[Date "1982.??.??"]
[Round "?"]
[White "Seirawan,Y"]
[Black "Karpov,A"]
[Result "1-0"] 

1.Nf3 Nf6 2.c4 e6 3.Nc3 d5 4.d4 Be7 5.Bg5 h6 6.Bh4 O-O 7.Rc1 b6 8.cxd5 Nxd5 9.Nxd5 exd5 10.Bxe7 Qxe7 11.g3 Re8 12.Rc3 Na6 13.Qa4 c5 14.Re3 Be6 15.Qxa6 cxd4 16.Rb3 Bf5 17.Bg2 Bc2 18.Nxd4 Bxb3 19.Nxb3 Rac8 20.Bf3 Rc2 21.O-O Rxb2 22.Rd1 Rd8 23.Nd4 Rd7 24.Nc6 Qe8 25.Nxa7 Rc7 26.a4 Qa8 27.Rxd5 Qxa7 28.Rd8+ Kh7 29.Qd3+ f5 30.Qxf5+ g6 31.Qe6 1-0 

[Event "ol"]
[Site "Luzern"]
[Date "1982.??.??"]
[Round "?"]
[White "Korchnoi,V"]
[Black "Kasparov,G"]
[Result "0-1"] 

1.d4 Nf6 2.c4 g6 3.g3 Bg7 4.Bg2 c5 5.d5 d6 6.Nc3 O-O 7.Nf3 e6 8.O-O exd5 9.cxd5 a6 10.a4 Re8 11.Nd2 Nbd7 12.h3 Rb8 13.Nc4 Ne5 14.Na3 Nh5 15.e4 Rf8 16.Kh2 f5 17.f4 b5 18.axb5 axb5 19.Naxb5 fxe4 20.Bxe4 Bd7 21.Qe2 Qb6 22.Na3 Rbe8 23.Bd2 Qxb2 24.fxe5 Bxe5 25.Nc4 Nxg3 26.Rxf8+ Rxf8 27.Qe1 Nxe4+ 28.Kg2 Qc2 29.Nxe5 Rf2+ 30.Qxf2 Nxf2 31.Ra2 Qf5 32.Nxd7 Nd3 33.Bh6 Qxd7 34.Ra8+ Kf7 35.Rh8 Kf6 36.Kf3 Qxh3+ 0-1 

[Event "?"]
[Site "Niksic"]
[Date "1983.??.??"]
[Round "?"]
[White "Kasparov,G"]
[Black "Portisch,L"]
[Result "1-0"] 

1.d4 Nf6 2.c4 e6 3.Nf3 b6 4.Nc3 Bb7 5.a3 d5 6.cxd5 Nxd5 7.e3 Nxc3 8.bxc3 Be7 9.Bb5+ c6 10.Bd3 c5 11.O-O Nc6 12.Bb2 Rc8 13.Qe2 O-O 14.Rad1 Qc7 15.c4 cxd4 16.exd4 Na5 17.d5 exd5 18.cxd5 Bxd5 19.Bxh7+ Kxh7 20.Rxd5 Kg8 21.Bxg7 Kxg7 22.Ne5 Rfd8 23.Qg4+ Kf8 24.Qf5 f6 25.Nd7+ Rxd7 26.Rxd7 Qc5 27.Qh7 Rc7 28.Qh8+ Kf7 29.Rd3 Nc4 30.Rfd1 Ne5 31.Qh7+ Ke6 32.Qg8+ Kf5 33.g4+ Kf4 34.Rd4+ Kf3 35.Qb3+ 1-0 

[Event "WCh II"]
[Site "Moscow"]
[Date "1985.??.??"]
[Round "16"]
[White "Karpov,A"]
[Black "Kasparov,G"]
[Result "0-1"] 

1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nc6 5.Nb5 d6 6.c4 Nf6 7.N1c3 a6 8.Na3 d5 9.cxd5 exd5 10.exd5 Nb4 11.Be2 Bc5 12.O-O O-O 13.Bf3 Bf5 14.Bg5 Re8 15.Qd2 b5 16.Rad1 Nd3 17.Nab1 h6 18.Bh4 b4 19.Na4 Bd6 20.Bg3 Rc8 21.b3 g5 22.Bxd6 Qxd6 23.g3 Nd7 24.Bg2 Qf6 25.a3 a5 26.axb4 axb4 27.Qa2 Bg6 28.d6 g4 29.Qd2 Kg7 30.f3 Qxd6 31.fxg4 Qd4+ 32.Kh1 Nf6 33.Rf4 Ne4 34.Qxd3 Nf2+ 35.Rxf2 Bxd3 36.Rfd2 Qe3 37.Rxd3 Rc1 38.Nb2 Qf2 39.Nd2 Rxd1+ 40.Nxd1 Re1+ 0-1 

[Event "?"]
[Site "Wijk"]
[Date "1985.??.??"]
[Round "?"]
[White "Beliavsky,A"]
[Black "Nunn,J"]
[Result "0-1"] 

1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.f3 O-O 6.Be3 Nbd7 7.Qd2 c5 8.d5 Ne5 9.h3 Nh5 10.Bf2 f5 11.exf5 Rxf5 12.g4 Rxf3 13.gxh5 Qf8 14.Ne4 Bh6 15.Qc2 Qf4 16.Ne2 Rxf2 17.Nxf2 Nf3+ 18.Kd1 Qh4 19.Nd3 Bf5 20.Nec1 Nd2 21.hxg6 hxg6 22.Bg2 Nxc4 23.Qf2 Ne3+ 24.Ke2 Qc4 25.Bf3 Rf8 26.Rg1 Nc2 27.Kd1 Bxd3 0-1 

[Event "WCh III"]
[Site "Leningrad"]
[Date "1986.??.??"]
[Round "22"]
[White "Kasparov,G"]
[Black "Karpov,A"]
[Result "1-0"] 

1.d4 Nf6 2.c4 e6 3.Nf3 d5 4.Nc3 Be7 5.Bg5 h6 6.Bxf6 Bxf6 7.e3 O-O 8.Rc1 c6 9.Bd3 Nd7 10.O-O dxc4 11.Bxc4 e5 12.h3 exd4 13.exd4 Nb6 14.Bb3 Bf5 15.Re1 a5 16.a3 Re8 17.Rxe8+ Qxe8 18.Qd2 Nd7 19.Qf4 Bg6 20.h4 Qd8 21.Na4 h5 22.Re1 b5 23.Nc3 Qb8 24.Qe3 b4 25.Ne4 bxa3 26.Nxf6+ Nxf6 27.bxa3 Nd5 28.Bxd5 cxd5 29.Ne5 Qd8 30.Qf3 Ra6 31.Rc1 Kh7 32.Qh3 Rb6 33.Rc8 Qd6 34.Qg3 a4 35.Ra8 Qe6 36.Rxa4 Qf5 37.Ra7 Rb1+ 38.Kh2 Rc1 39.Rb7 Rc2 40.f3 Rd2 41.Nd7 Rxd4 42.Nf8+ Kh6 43.Rb4 Rc4 44.Rxc4 dxc4 45.Qd6 c3 46.Qd4 1-0 

[Event "?"]
[Site "Reykjavik"]
[Date "1987.??.??"]
[Round "?"]
[White "Tal,M"]
[Black "Hjartarson,J"]
[Result "1-0"] 

1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d6 9.h3 Na5 10.Bc2 c5 11.d4 Qc7 12.Nbd2 Bd7 13.Nf1 cxd4 14.cxd4 Rac8 15.Ne3 Nc6 16.d5 Nb4 17.Bb1 a5 18.a3 Na6 19.b4 g6 20.Bd2 axb4 21.axb4 Qb7 22.Bd3 Nc7 23.Nc2 Nh5 24.Be3 Ra8 25.Qd2 Rxa1 26.Nxa1 f5 27.Bh6 Ng7 28.Nb3 f4 29.Na5 Qb6 30.Rc1 Ra8 31.Qc2 Nce8 32.Qb3 Bf6 33.Nc6 Nh5 34.Qb2 Bg7 35.Bxg7 Kxg7 36.Rc5 Qa6 37.Rxb5 Nc7 38.Rb8 Qxd3 39.Ncxe5 Qd1+ 40.Kh2 Ra1 41.Ng4+ Kf7 42.Nh6+ Ke7 43.Ng8+ 1-0
';

    private $tournamentPgn = '[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.18"]
[Round "9.1"]
[White "So, Wesley"]
[Black "Vachier-Lagrave, Maxime"]
[Result "1/2-1/2"]
[BlackElo "2804"]
[WhiteElo "2794"]
[LiveChessVersion "1.4.8"]
[ECO "A04"]

1. Nf3 {[%clk 1:59:56]} c5 {[%clk 1:59:51]} 2. c4 {[%clk 1:59:51]} Nc6
{[%clk 1:59:48]} 3. Nc3 {[%clk 1:59:45]} e5 {[%clk 1:59:45]} 4. e3
{[%clk 1:59:33]} Nf6 {[%clk 1:59:40]} 5. Be2 {[%clk 1:59:26]} d5 {[%clk 1:59:14]}
6. d4 {[%clk 1:59:18]} cxd4 {[%clk 1:58:32]} 7. exd4 {[%clk 1:59:11]} e4
{[%clk 1:58:29]} 8. Ne5 {[%clk 1:59:04]} dxc4 {[%clk 1:58:26]} 9. Bxc4
{[%clk 1:58:42]} Nxe5 {[%clk 1:58:21]} 10. dxe5 {[%clk 1:58:38]} Qxd1+
{[%clk 1:58:18]} 11. Kxd1 {[%clk 1:58:31]} Ng4 {[%clk 1:58:15]} 12. e6
{[%clk 1:58:24]} fxe6 {[%clk 1:58:11]} 13. Nxe4 {[%clk 1:57:17]} Bd7
{[%clk 1:57:19]} 14. f3 {[%clk 1:56:56]} Ne5 {[%clk 1:53:13]} 15. Bb3
{[%clk 1:56:50]} Rd8 {[%clk 1:42:01]} 16. Bd2 {[%clk 1:56:12]} Nd3
{[%clk 1:41:54]} 17. Kc2 {[%clk 1:49:59]} Nb4+ {[%clk 1:41:47]} 18. Bxb4
{[%clk 1:49:55]} Bxb4 {[%clk 1:41:40]} 19. Nc3 {[%clk 1:49:48]} Ke7
{[%clk 1:36:22]} 20. Rhe1 {[%clk 1:48:59]} Bxc3 {[%clk 1:36:16]} 21. Kxc3
{[%clk 1:46:18]} Rc8+ {[%clk 1:33:40]} 22. Kd2 {[%clk 1:46:11]} Rhd8
{[%clk 1:33:36]} 23. Ke3 {[%clk 1:46:06]} e5 {[%clk 1:29:17]} 24. Rad1
{[%clk 1:43:07]} Bc6 {[%clk 1:28:23]} 25. h4 {[%clk 1:41:49]} h6 {[%clk 1:27:41]}
26. a3 {[%clk 1:40:10]} Rxd1 {[%clk 1:22:21]} 27. Rxd1 {[%clk 1:40:05]} Rf8
{[%clk 1:21:39]} 28. Rf1 {[%clk 1:37:25]} Rf4 {[%clk 1:20:34]} 29. g3
{[%clk 1:37:12]} Rd4 {[%clk 1:20:28]} 30. Rd1 {[%clk 1:36:36]} Rxd1
{[%clk 1:20:24]} 31. Bxd1 {[%clk 1:36:34]} g5 {[%clk 1:19:44]} 32. hxg5
{[%clk 1:36:30]} hxg5 {[%clk 1:19:39]} 33. f4 {[%clk 1:36:26]} gxf4+
{[%clk 1:19:36]} 34. gxf4 {[%clk 1:36:23]} exf4+ {[%clk 1:19:34]} 35. Kxf4
{[%clk 1:36:19]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.18"]
[Round "9.2"]
[White "Anand, Viswanathan"]
[Black "Kramnik, Vladimir"]
[Result "1/2-1/2"]
[BlackElo "2809"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:54]} Nf6 {[%clk 1:59:47]} 2. c4 {[%clk 1:59:38]} e6
{[%clk 1:59:39]} 3. Nf3 {[%clk 1:59:30]} d5 {[%clk 1:59:32]} 4. Nc3
{[%clk 1:59:19]} Be7 {[%clk 1:55:54]} 5. Bf4 {[%clk 1:58:45]} O-O
{[%clk 1:55:47]} 6. e3 {[%clk 1:58:37]} b6 {[%clk 1:54:41]} 7. Bd3
{[%clk 1:52:51]} c5 {[%clk 1:52:16]} 8. dxc5 {[%clk 1:45:54]} bxc5
{[%clk 1:49:56]} 9. O-O {[%clk 1:41:57]} Nc6 {[%clk 1:48:05]} 10. cxd5
{[%clk 1:33:59]} exd5 {[%clk 1:44:46]} 11. Rc1 {[%clk 1:32:48]} h6
{[%clk 1:35:23]} 12. h3 {[%clk 1:19:49]} Be6 {[%clk 1:34:23]} 13. Bb5
{[%clk 1:15:50]} Qb6 {[%clk 1:27:38]} 14. Qa4 {[%clk 1:14:36]} Rfc8
{[%clk 1:17:52]} 15. Ne5 {[%clk 1:08:50]} Nxe5 {[%clk 1:11:44]} 16. Bxe5
{[%clk 1:07:46]} a6 {[%clk 1:11:21]} 17. Be2 {[%clk 1:07:15]} Rd8
{[%clk 1:06:46]} 18. Bf3 {[%clk 1:04:59]} Nd7 {[%clk 0:54:31]} 19. Bg3
{[%clk 1:00:41]} Nf6 {[%clk 0:52:41]} 20. Rfd1 {[%clk 0:55:58]} Rac8
{[%clk 0:45:31]} 21. Be5 {[%clk 0:52:11]} Nd7 {[%clk 0:44:41]} 22. Bg3
{[%clk 0:50:53]} Nf6 {[%clk 0:44:30]} 23. Be5 {[%clk 0:50:34]} Nd7
{[%clk 0:43:53]} 24. Bg3 {[%clk 0:50:25]} Nf6 {[%clk 0:43:48]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.18"]
[Round "9.3"]
[White "Giri, Anish"]
[Black "Caruana, Fabiano"]
[Result "1/2-1/2"]
[BlackElo "2823"]
[WhiteElo "2771"]
[LiveChessVersion "1.4.8"]
[ECO "D27"]

1. d4 {[%clk 1:59:59]} d5 {[%clk 1:59:55]} 2. Nf3 {[%clk 1:59:21]} Nf6
{[%clk 1:59:49]} 3. c4 {[%clk 1:59:11]} dxc4 {[%clk 1:59:43]} 4. e3
{[%clk 1:59:00]} e6 {[%clk 1:59:37]} 5. Bxc4 {[%clk 1:58:55]} c5 {[%clk 1:59:29]}
6. O-O {[%clk 1:57:43]} a6 {[%clk 1:59:24]} 7. b3 {[%clk 1:57:02]} cxd4
{[%clk 1:55:14]} 8. Nxd4 {[%clk 1:56:12]} Bd7 {[%clk 1:55:07]} 9. Bb2
{[%clk 1:54:42]} Nc6 {[%clk 1:54:35]} 10. Nf3 {[%clk 1:53:57]} Be7
{[%clk 1:35:37]} 11. Nbd2 {[%clk 1:49:59]} O-O {[%clk 1:35:28]} 12. Rc1
{[%clk 1:47:43]} Rc8 {[%clk 1:26:50]} 13. Qe2 {[%clk 1:46:40]} Nb4
{[%clk 1:21:13]} 14. a3 {[%clk 1:44:38]} b5 {[%clk 1:20:22]} 15. axb4
{[%clk 1:33:35]} bxc4 {[%clk 1:20:14]} 16. Nxc4 {[%clk 1:25:34]} Bxb4
{[%clk 1:14:31]} 17. Ra1 {[%clk 1:05:41]} Bb5 {[%clk 1:11:27]} 18. Nd4
{[%clk 1:05:30]} Bxc4 {[%clk 1:08:54]} 19. bxc4 {[%clk 1:05:26]} a5
{[%clk 1:08:06]} 20. Rfc1 {[%clk 1:03:26]} Nd7 {[%clk 1:04:46]} 21. Nb3
{[%clk 1:02:40]} Qg5 {[%clk 0:57:38]} 22. c5 {[%clk 0:59:07]} Nxc5
{[%clk 0:50:16]} 23. Nxa5 {[%clk 0:58:58]} Ne4 {[%clk 0:46:51]} 24. Nc6
{[%clk 0:55:53]} Bc5 {[%clk 0:44:28]} 25. Nd4 {[%clk 0:53:04]} Bxd4
{[%clk 0:44:02]} 26. Bxd4 {[%clk 0:52:55]} Rxc1+ {[%clk 0:43:51]} 27. Rxc1
{[%clk 0:52:53]} e5 {[%clk 0:43:35]} 28. Bb2 {[%clk 0:52:28]} Rd8
{[%clk 0:31:59]} 29. Rd1 {[%clk 0:38:31]} Rxd1+ {[%clk 0:29:21]} 30. Qxd1
{[%clk 0:38:25]} h5 {[%clk 0:28:45]} 31. Qd3 {[%clk 0:28:32]} Nf6
{[%clk 0:27:20]} 32. h3 {[%clk 0:23:04]} e4 {[%clk 0:27:05]} 33. Qd8+
{[%clk 0:20:10]} Kh7 {[%clk 0:27:00]} 34. Qe7 {[%clk 0:19:53]} Qg6
{[%clk 0:26:47]} 35. Bxf6 {[%clk 0:18:33]} gxf6 {[%clk 0:26:43]} 36. Qc5
{[%clk 0:17:27]} Kg7 {[%clk 0:26:09]} 37. Qd5 {[%clk 0:17:16]} f5
{[%clk 0:23:58]} 38. Qe5+ {[%clk 0:17:06]} Qf6 {[%clk 0:15:13]} 39. Qg3+
{[%clk 0:12:55]} Kh7 {[%clk 0:14:30]} 40. Kh2 {[%clk 1:12:36]} Qe7
{[%clk 1:13:18]} 41. Qf4 {[%clk 1:12:48]} Kg6 {[%clk 1:12:15]} 42. Kg3
{[%clk 1:12:09]} Qd8 {[%clk 1:11:53]} 43. Qe5 {[%clk 1:11:27]} Qg5+
{[%clk 1:11:33]} 44. Kh2 {[%clk 1:11:53]} Qd8 {[%clk 1:11:59]} 45. Qg3+
{[%clk 1:11:54]} Kh7 {[%clk 1:11:57]} 46. Qf4 {[%clk 1:10:44]} Kg6
{[%clk 1:12:17]} 47. Qe5 {[%clk 1:11:11]} Qd2 {[%clk 1:10:57]} 48. Qg3+
{[%clk 1:04:09]} Kh6 {[%clk 1:11:13]} 49. Qf4+ {[%clk 1:04:38]} Kg6
{[%clk 1:11:38]} 50. Qg3+ {[%clk 1:05:07]} Kh6 {[%clk 1:12:03]} 51. Qh4
{[%clk 1:05:34]} Qd6+ {[%clk 1:06:31]} 52. Qf4+ {[%clk 1:03:05]} Qxf4+
{[%clk 1:06:55]} 53. exf4 {[%clk 1:03:32]} Kg6 {[%clk 1:07:17]} 54. Kg1
{[%clk 1:01:38]} Kg7 {[%clk 1:06:57]} 55. Kf1 {[%clk 1:01:42]} Kf6
{[%clk 1:07:21]} 56. Ke2 {[%clk 1:00:23]} Ke6 {[%clk 1:07:46]} 57. Kd2
{[%clk 1:00:41]} Kd6 {[%clk 1:08:05]} 58. Ke2 {[%clk 1:00:29]} Ke6
{[%clk 1:08:30]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.18"]
[Round "9.4"]
[White "Adams, Michael"]
[Black "Nakamura, Hikaru"]
[Result "1/2-1/2"]
[BlackElo "2779"]
[WhiteElo "2748"]
[LiveChessVersion "1.4.8"]
[ECO "C67"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:52]} 2. Nf3 {[%clk 1:59:51]} Nc6
{[%clk 1:59:40]} 3. Bb5 {[%clk 1:59:44]} Nf6 {[%clk 1:59:33]} 4. O-O
{[%clk 1:59:38]} Nxe4 {[%clk 1:59:28]} 5. Re1 {[%clk 1:59:34]} Nd6
{[%clk 1:59:20]} 6. Nxe5 {[%clk 1:59:29]} Be7 {[%clk 1:59:01]} 7. Bf1
{[%clk 1:59:23]} Nf5 {[%clk 1:58:57]} 8. Nf3 {[%clk 1:59:14]} O-O
{[%clk 1:58:43]} 9. d4 {[%clk 1:59:01]} d5 {[%clk 1:58:38]} 10. c3
{[%clk 1:58:39]} Re8 {[%clk 1:58:32]} 11. Bd3 {[%clk 1:55:12]} Bd6
{[%clk 1:55:29]} 12. Rxe8+ {[%clk 1:54:25]} Qxe8 {[%clk 1:55:21]} 13. Qc2
{[%clk 1:51:14]} g6 {[%clk 1:55:12]} 14. Nbd2 {[%clk 1:50:37]} Bd7
{[%clk 1:54:00]} 15. Nf1 {[%clk 1:49:23]} b6 {[%clk 1:51:14]} 16. Ng3
{[%clk 1:27:22]} Nxg3 {[%clk 1:48:00]} 17. hxg3 {[%clk 1:26:11]} f6
{[%clk 1:45:21]} 18. Bf4 {[%clk 1:23:33]} Bxf4 {[%clk 1:27:39]} 19. gxf4
{[%clk 1:23:25]} Qf7 {[%clk 1:27:36]} 20. Nh4 {[%clk 1:03:59]} Kg7
{[%clk 1:20:23]} 21. g3 {[%clk 1:03:26]} Ne7 {[%clk 1:12:03]} 22. Re1
{[%clk 0:48:31]} Re8 {[%clk 1:10:48]} 23. Re3 {[%clk 0:48:08]} Nc8
{[%clk 1:01:22]} 24. Ng2 {[%clk 0:47:43]} Nd6 {[%clk 0:59:06]} 25. Rxe8
{[%clk 0:47:27]} Qxe8 {[%clk 0:57:38]} 26. Ne3 {[%clk 0:47:18]} Be6
{[%clk 0:57:30]} 27. f5 {[%clk 0:40:37]} Bf7 {[%clk 0:56:37]} 28. fxg6
{[%clk 0:40:31]} hxg6 {[%clk 0:56:33]} 29. Qe2 {[%clk 0:40:11]} Be6
{[%clk 0:48:41]} 30. Ng2 {[%clk 0:37:05]} c6 {[%clk 0:44:13]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.18"]
[Round "9.5"]
[White "Aronian, Levon"]
[Black "Topalov, Veselin"]
[Result "0-1"]
[BlackElo "2760"]
[WhiteElo "2785"]
[LiveChessVersion "1.4.8"]
[ECO "A37"]

1. c4 {[%clk 1:59:56]} g6 {[%clk 1:59:05]} 2. Nc3 {[%clk 1:59:23]} c5
{[%clk 1:58:50]} 3. g3 {[%clk 1:59:18]} Bg7 {[%clk 1:58:40]} 4. Bg2
{[%clk 1:59:14]} Nc6 {[%clk 1:58:21]} 5. Nf3 {[%clk 1:59:08]} d6 {[%clk 1:57:43]}
6. O-O {[%clk 1:59:02]} e6 {[%clk 1:57:36]} 7. e3 {[%clk 1:58:58]} Nge7
{[%clk 1:57:14]} 8. d4 {[%clk 1:58:53]} O-O {[%clk 1:56:56]} 9. Re1
{[%clk 1:58:50]} a6 {[%clk 1:54:57]} 10. Bd2 {[%clk 1:53:00]} Rb8
{[%clk 1:43:56]} 11. Rc1 {[%clk 1:47:43]} b6 {[%clk 1:30:26]} 12. Ne2
{[%clk 1:46:34]} e5 {[%clk 1:24:40]} 13. Bc3 {[%clk 1:45:37]} h6 {[%clk 1:21:14]}
14. d5 {[%clk 1:34:07]} Nb4 {[%clk 1:20:01]} 15. Ra1 {[%clk 1:32:30]} b5
{[%clk 1:05:38]} 16. a3 {[%clk 1:28:27]} bxc4 {[%clk 1:05:22]} 17. axb4
{[%clk 1:28:22]} cxb4 {[%clk 1:05:11]} 18. Bd2 {[%clk 1:28:17]} Nxd5
{[%clk 1:02:30]} 19. Qc1 {[%clk 1:28:03]} c3 {[%clk 0:55:18]} 20. bxc3
{[%clk 1:27:44]} b3 {[%clk 0:55:12]} 21. Qb1 {[%clk 1:13:08]} Nf6
{[%clk 0:44:06]} 22. Qb2 {[%clk 1:13:03]} Qc7 {[%clk 0:40:11]} 23. c4
{[%clk 1:05:11]} Qxc4 {[%clk 0:39:43]} 24. Nc3 {[%clk 1:05:00]} Be6
{[%clk 0:35:10]} 25. Rec1 {[%clk 1:03:29]} Nd7 {[%clk 0:27:05]} 26. e4
{[%clk 0:59:13]} Nc5 {[%clk 0:23:25]} 27. Bf1 {[%clk 0:53:30]} Qb4
{[%clk 0:18:55]} 28. Be3 {[%clk 0:45:51]} Rfc8 {[%clk 0:16:41]} 29. Nd2
{[%clk 0:45:02]} a5 {[%clk 0:14:40]} 30. Bxc5 {[%clk 0:43:37]} Rxc5
{[%clk 0:13:39]} 31. Ra4 {[%clk 0:43:30]} Qb7 {[%clk 0:11:59]} 32. Bc4
{[%clk 0:42:38]} Qc6 {[%clk 0:09:43]} 33. Bd5 {[%clk 0:35:57]} Bxd5
{[%clk 0:09:15]} 34. exd5 {[%clk 0:35:52]} Qd7 {[%clk 0:08:50]} 35. Ra3
{[%clk 0:34:32]} a4 {[%clk 0:05:45]} 36. Nxa4 {[%clk 0:34:21]} Rxd5
{[%clk 0:04:08]} 37. Nxb3 {[%clk 0:31:22]} e4 {[%clk 0:03:43]} 38. Qa2
{[%clk 0:28:38]} Qf5 {[%clk 0:02:43]} 39. Re1 {[%clk 0:21:47]} Rdb5
{[%clk 0:01:55]} 40. Rc1 {[%clk 1:08:42]} d5 {[%clk 1:00:55]} 41. Nac5
{[%clk 1:07:03]} d4 {[%clk 0:56:36]} 42. Ra7 {[%clk 1:03:07]} d3 {[%clk 0:53:19]}
43. Rc7 {[%clk 0:51:58]} h5 {[%clk 0:45:29]} 44. Qa4 {[%clk 0:37:28]} h4
{[%clk 0:34:38]} 45. Qxe4 {[%clk 0:23:24]} Qxe4 {[%clk 0:34:48]} 46. Nxe4
{[%clk 0:23:51]} Rxb3 {[%clk 0:35:09]} 47. gxh4 {[%clk 0:23:06]} Bh6
{[%clk 0:33:27]} 48. Rf1 {[%clk 0:19:41]} R3b4 {[%clk 0:29:26]} 49. f3
{[%clk 0:17:22]} Rb2 {[%clk 0:24:57]} 50. Nf6+ {[%clk 0:06:19]} Kg7
{[%clk 0:23:55]} 51. Ng4 {[%clk 0:06:44]} d2 {[%clk 0:20:53]} 52. Rd7
{[%clk 0:02:06]} Re8 {[%clk 0:21:00]} 53. Nf2 {[%clk 0:00:40]} Re1
{[%clk 0:20:35]} 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.17"]
[Round "8.1"]
[White "Caruana, Fabiano"]
[Black "So, Wesley"]
[Result "1/2-1/2"]
[BlackElo "2794"]
[WhiteElo "2823"]
[LiveChessVersion "1.4.8"]
[ECO "C65"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:53]} 2. Nf3 {[%clk 1:59:53]} Nc6
{[%clk 1:59:49]} 3. Bb5 {[%clk 1:59:49]} Nf6 {[%clk 1:59:46]} 4. d3
{[%clk 1:59:44]} Bc5 {[%clk 1:59:43]} 5. c3 {[%clk 1:59:19]} O-O {[%clk 1:59:37]}
6. O-O {[%clk 1:58:58]} d5 {[%clk 1:59:33]} 7. exd5 {[%clk 1:58:00]} Qxd5
{[%clk 1:59:28]} 8. Bc4 {[%clk 1:57:54]} Qd8 {[%clk 1:59:24]} 9. Nbd2
{[%clk 1:57:07]} a5 {[%clk 1:59:12]} 10. a4 {[%clk 1:56:06]} h6 {[%clk 1:54:35]}
11. Re1 {[%clk 1:53:59]} Bf5 {[%clk 1:39:37]} 12. Nf1 {[%clk 1:47:38]} e4
{[%clk 1:34:12]} 13. Ng3 {[%clk 1:40:15]} Bh7 {[%clk 1:34:03]} 14. dxe4
{[%clk 1:31:48]} Qxd1 {[%clk 1:30:53]} 15. Rxd1 {[%clk 1:31:42]} Bxe4
{[%clk 1:30:22]} 16. Bf4 {[%clk 1:30:15]} Bb6 {[%clk 1:27:11]} 17. Nxe4
{[%clk 1:11:39]} Nxe4 {[%clk 1:27:05]} 18. Bg3 {[%clk 1:11:36]} Rae8
{[%clk 1:15:33]} 19. Rd7 {[%clk 0:53:53]} Nxg3 {[%clk 0:50:37]} 20. hxg3
{[%clk 0:51:26]} Ne5 {[%clk 0:50:34]} 21. Nxe5 {[%clk 0:51:20]} Rxe5
{[%clk 0:50:32]} 22. Rad1 {[%clk 0:48:28]} Rf5 {[%clk 0:49:54]} 23. R1d2
{[%clk 0:48:01]} Re8 {[%clk 0:49:49]} 24. Kf1 {[%clk 0:28:02]} Kf8
{[%clk 0:49:45]} 25. f3 {[%clk 0:25:21]} Re7 {[%clk 0:48:32]} 26. Rd8+
{[%clk 0:25:09]} Re8 {[%clk 0:48:27]} 27. R8d7 {[%clk 0:25:00]} Re7
{[%clk 0:48:19]} 28. Rd8+ {[%clk 0:24:45]} Re8 {[%clk 0:48:14]} 29. R2d7
{[%clk 0:24:12]} Rxd8 {[%clk 0:43:57]} 30. Rxd8+ {[%clk 0:24:06]} Ke7
{[%clk 0:43:54]} 31. Rg8 {[%clk 0:23:17]} Rg5 {[%clk 0:43:47]} 32. g4
{[%clk 0:23:08]} Bc5 {[%clk 0:43:32]} 33. Bd3 {[%clk 0:13:41]} Bd6
{[%clk 0:41:17]} 34. Kf2 {[%clk 0:12:19]} Kf6 {[%clk 0:40:42]} 35. Re8
{[%clk 0:10:11]} Rd5 {[%clk 0:40:32]} 36. Ke2 {[%clk 0:09:55]} Re5+
{[%clk 0:40:28]} 37. Rxe5 {[%clk 0:09:51]} Kxe5 {[%clk 0:40:24]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.17"]
[Round "8.2"]
[White "Nakamura, Hikaru"]
[Black "Aronian, Levon"]
[Result "1/2-1/2"]
[BlackElo "2785"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "D38"]

1. d4 {[%clk 1:59:55]} Nf6 {[%clk 1:59:54]} 2. c4 {[%clk 1:59:50]} e6
{[%clk 1:59:49]} 3. Nf3 {[%clk 1:59:40]} d5 {[%clk 1:59:44]} 4. Nc3
{[%clk 1:59:13]} Bb4 {[%clk 1:59:37]} 5. Qb3 {[%clk 1:58:56]} c5 {[%clk 1:59:26]}
6. dxc5 {[%clk 1:58:21]} Nc6 {[%clk 1:59:14]} 7. Bg5 {[%clk 1:57:53]} dxc4
{[%clk 1:58:57]} 8. Qxc4 {[%clk 1:57:27]} Qa5 {[%clk 1:58:47]} 9. Rc1
{[%clk 1:57:01]} Qxc5 {[%clk 1:56:24]} 10. Qxc5 {[%clk 1:52:03]} Bxc5
{[%clk 1:56:16]} 11. e3 {[%clk 1:51:51]} Bb4 {[%clk 1:51:37]} 12. a3
{[%clk 1:42:06]} Bxc3+ {[%clk 1:51:31]} 13. Rxc3 {[%clk 1:42:02]} Ne4
{[%clk 1:51:24]} 14. Rc1 {[%clk 1:41:26]} Nxg5 {[%clk 1:44:49]} 15. Nxg5
{[%clk 1:41:19]} Ke7 {[%clk 1:44:41]} 16. Ne4 {[%clk 1:08:05]} Bd7
{[%clk 1:39:04]} 17. Nc5 {[%clk 1:05:55]} Rhc8 {[%clk 1:38:58]} 18. Nxd7
{[%clk 1:02:08]} Kxd7 {[%clk 1:38:53]} 19. Bb5 {[%clk 1:02:05]} a6
{[%clk 1:38:47]} 20. Bxc6+ {[%clk 1:01:52]} Rxc6 {[%clk 1:38:41]} 21. Rxc6
{[%clk 1:01:37]} Kxc6 {[%clk 1:38:37]} 22. Ke2 {[%clk 1:01:29]} Rd8
{[%clk 1:35:10]} 23. Rc1+ {[%clk 1:00:45]} Kd7 {[%clk 1:35:03]} 24. Rd1+
{[%clk 1:00:17]} Ke7 {[%clk 1:34:54]} 25. Rc1 {[%clk 0:59:46]} Kd7
{[%clk 1:34:48]} 26. Rd1+ {[%clk 0:58:28]} Ke7 {[%clk 1:34:43]} 27. Rc1
{[%clk 0:55:06]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.17"]
[Round "8.3"]
[White "Kramnik, Vladimir"]
[Black "Giri, Anish"]
[Result "1/2-1/2"]
[BlackElo "2771"]
[WhiteElo "2809"]
[LiveChessVersion "1.4.8"]
[ECO "B91"]

1. e4 {[%clk 1:59:57]} c5 {[%clk 1:59:57]} 2. Nf3 {[%clk 1:59:52]} d6
{[%clk 1:59:50]} 3. d4 {[%clk 1:59:47]} cxd4 {[%clk 1:59:46]} 4. Nxd4
{[%clk 1:59:43]} Nf6 {[%clk 1:59:42]} 5. Nc3 {[%clk 1:59:32]} a6 {[%clk 1:59:38]}
6. g3 {[%clk 1:59:23]} e5 {[%clk 1:59:34]} 7. Nde2 {[%clk 1:59:17]} Be6
{[%clk 1:59:32]} 8. Bg2 {[%clk 1:58:34]} h5 {[%clk 1:59:29]} 9. Bg5
{[%clk 1:52:28]} Nbd7 {[%clk 1:59:17]} 10. Qd2 {[%clk 1:48:07]} Be7
{[%clk 1:57:19]} 11. a4 {[%clk 1:41:01]} Rc8 {[%clk 1:57:04]} 12. O-O
{[%clk 1:39:26]} Nf8 {[%clk 1:55:21]} 13. Bxf6 {[%clk 1:30:21]} Bxf6
{[%clk 1:53:28]} 14. Rfd1 {[%clk 1:29:13]} Be7 {[%clk 1:36:50]} 15. Nd5
{[%clk 1:26:34]} h4 {[%clk 1:35:57]} 16. Nec3 {[%clk 1:14:49]} Nh7
{[%clk 1:31:47]} 17. Ra3 {[%clk 1:02:06]} Rc6 {[%clk 1:21:30]} 18. Rb3
{[%clk 0:58:55]} Qb8 {[%clk 1:14:45]} 19. Na2 {[%clk 0:51:31]} Bxd5
{[%clk 1:00:15]} 20. Qxd5 {[%clk 0:50:52]} Qc8 {[%clk 0:59:48]} 21. Nb4
{[%clk 0:42:24]} Nf6 {[%clk 0:59:12]} 22. Qd2 {[%clk 0:36:49]} Rc5
{[%clk 0:57:52]} 23. Rc1 {[%clk 0:34:51]} hxg3 {[%clk 0:54:33]} 24. hxg3
{[%clk 0:33:59]} g6 {[%clk 0:53:53]} 25. Rd3 {[%clk 0:32:38]} Kf8
{[%clk 0:49:06]} 26. c3 {[%clk 0:31:02]} Kg7 {[%clk 0:48:39]} 27. Rd1
{[%clk 0:28:29]} Qd7 {[%clk 0:42:43]} 28. b3 {[%clk 0:27:05]} Qg4
{[%clk 0:40:14]} 29. c4 {[%clk 0:23:11]} Nxe4 {[%clk 0:35:41]} 30. f3
{[%clk 0:22:13]} Nxd2 {[%clk 0:35:31]} 31. fxg4 {[%clk 0:22:08]} Nxc4
{[%clk 0:35:27]} 32. bxc4 {[%clk 0:21:17]} Rxc4 {[%clk 0:35:20]} 33. Nd5
{[%clk 0:19:04]} Bd8 {[%clk 0:33:19]} 34. Ra1 {[%clk 0:17:17]} Rxg4
{[%clk 0:32:02]} 35. a5 {[%clk 0:16:36]} e4 {[%clk 0:27:13]} 36. Rb3
{[%clk 0:09:58]} Rh5 {[%clk 0:25:20]} 37. Ne3 {[%clk 0:03:08]} Rgg5
{[%clk 0:23:29]} 38. Kf2 {[%clk 0:01:47]} Rxa5 {[%clk 0:10:49]} 39. Rxa5
{[%clk 0:01:44]} Rxa5 {[%clk 0:07:48]} 40. Bxe4 {[%clk 1:01:56]} b5
{[%clk 1:08:02]} 41. Rd3 {[%clk 0:54:05]} Be7 {[%clk 1:07:46]} 42. Kf3
{[%clk 0:50:47]} Ra1 {[%clk 1:02:59]} 43. Nd5 {[%clk 0:46:45]} Bd8
{[%clk 0:43:12]} 44. Nf4 {[%clk 0:46:45]} Be7 {[%clk 0:37:32]} 45. Rc3
{[%clk 0:46:08]} d5 {[%clk 0:37:17]} 46. Bxd5 {[%clk 0:44:00]} Ra3
{[%clk 0:36:22]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.17"]
[Round "8.4"]
[White "Topalov, Veselin"]
[Black "Anand, Viswanathan"]
[Result "0-1"]
[BlackElo "2779"]
[WhiteElo "2760"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:56]} Nf6 {[%clk 1:59:51]} 2. c4 {[%clk 1:59:52]} e6
{[%clk 1:59:46]} 3. Nf3 {[%clk 1:59:43]} d5 {[%clk 1:59:39]} 4. Nc3
{[%clk 1:59:39]} Be7 {[%clk 1:59:33]} 5. Bf4 {[%clk 1:58:58]} O-O
{[%clk 1:59:24]} 6. e3 {[%clk 1:58:47]} c5 {[%clk 1:59:14]} 7. dxc5
{[%clk 1:58:38]} Bxc5 {[%clk 1:59:08]} 8. a3 {[%clk 1:57:09]} Nc6
{[%clk 1:57:43]} 9. Qc2 {[%clk 1:56:54]} Re8 {[%clk 1:57:15]} 10. O-O-O
{[%clk 1:53:11]} e5 {[%clk 1:56:36]} 11. Bg5 {[%clk 1:52:40]} d4 {[%clk 1:56:23]}
12. Nd5 {[%clk 1:51:18]} b5 {[%clk 1:56:13]} 13. Bxf6 {[%clk 1:47:05]} gxf6
{[%clk 1:56:00]} 14. cxb5 {[%clk 1:32:09]} Na5 {[%clk 1:45:50]} 15. exd4
{[%clk 1:24:25]} exd4 {[%clk 1:42:43]} 16. Nb4 {[%clk 1:16:26]} Bxb4
{[%clk 1:25:40]} 17. axb4 {[%clk 1:16:11]} Be6 {[%clk 1:25:23]} 18. Nxd4
{[%clk 1:09:05]} Rc8 {[%clk 1:25:05]} 19. Nc6 {[%clk 1:05:26]} Nxc6
{[%clk 1:24:51]} 20. bxc6 {[%clk 1:05:15]} Qb6 {[%clk 1:24:12]} 21. Qa4
{[%clk 0:58:26]} Rxc6+ {[%clk 1:11:34]} 22. Kb1 {[%clk 0:58:22]} Rd8
{[%clk 1:09:58]} 23. Rxd8+ {[%clk 0:52:36]} Qxd8 {[%clk 1:05:16]} 24. Be2
{[%clk 0:49:15]} Bf5+ {[%clk 1:01:30]} 25. Ka2 {[%clk 0:46:06]} Rc2
{[%clk 0:46:05]} 26. Rd1 {[%clk 0:44:23]} Qb6 {[%clk 0:38:08]} 27. Bg4
{[%clk 0:30:34]} Qe6+ {[%clk 0:31:12]} 28. Ka3 {[%clk 0:23:43]} Qe5
{[%clk 0:28:34]} 29. Qb3 {[%clk 0:21:04]} Bg6 {[%clk 0:26:27]} 30. Bf3
{[%clk 0:18:26]} Rxf2 {[%clk 0:25:08]} 31. h4 {[%clk 0:12:15]} Bc2
{[%clk 0:20:57]} 32. Rd8+ {[%clk 0:11:31]} Kg7 {[%clk 0:20:36]} 33. Qc3
{[%clk 0:10:17]} Qb5 {[%clk 0:20:19]} 34. Qc6 {[%clk 0:07:34]} Rxf3+
{[%clk 0:20:13]} 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.17"]
[Round "8.5"]
[White "Vachier-Lagrave, Maxime"]
[Black "Adams, Michael"]
[Result "1/2-1/2"]
[BlackElo "2748"]
[WhiteElo "2804"]
[LiveChessVersion "1.4.8"]
[ECO "C65"]

1. e4 {[%clk 1:59:58]} e5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:55]} Nc6
{[%clk 1:59:52]} 3. Bb5 {[%clk 1:59:53]} Nf6 {[%clk 1:59:45]} 4. d3
{[%clk 1:59:51]} Bc5 {[%clk 1:59:39]} 5. c3 {[%clk 1:59:47]} O-O {[%clk 1:59:24]}
6. O-O {[%clk 1:59:42]} Re8 {[%clk 1:59:12]} 7. Bg5 {[%clk 1:59:32]} h6
{[%clk 1:56:43]} 8. Bh4 {[%clk 1:58:37]} a6 {[%clk 1:55:26]} 9. Bc4
{[%clk 1:55:58]} d6 {[%clk 1:53:57]} 10. a4 {[%clk 1:50:43]} Ba7 {[%clk 1:52:47]}
11. Na3 {[%clk 1:50:00]} Be6 {[%clk 1:45:02]} 12. b4 {[%clk 1:46:20]} Nb8
{[%clk 1:35:25]} 13. Bxe6 {[%clk 1:41:18]} Rxe6 {[%clk 1:35:15]} 14. Nc4
{[%clk 1:41:08]} Nbd7 {[%clk 1:33:53]} 15. Ne3 {[%clk 1:39:40]} c6
{[%clk 1:20:56]} 16. Nd2 {[%clk 1:19:08]} a5 {[%clk 1:11:37]} 17. bxa5
{[%clk 1:12:18]} Qxa5 {[%clk 1:09:19]} 18. Ndc4 {[%clk 1:10:30]} Qa6
{[%clk 1:05:29]} 19. Nf5 {[%clk 1:08:45]} d5 {[%clk 1:02:12]} 20. Nce3
{[%clk 1:08:24]} Kh7 {[%clk 0:50:55]} 21. exd5 {[%clk 0:58:47]} Nxd5
{[%clk 0:46:43]} 22. Qh5 {[%clk 0:55:15]} Rf8 {[%clk 0:43:21]} 23. Nxd5
{[%clk 0:50:16]} cxd5 {[%clk 0:43:13]} 24. Be7 {[%clk 0:50:12]} Nf6
{[%clk 0:41:01]} 25. Qh3 {[%clk 0:50:03]} Re8 {[%clk 0:39:19]} 26. Bb4
{[%clk 0:49:38]} h5 {[%clk 0:34:35]} 27. d4 {[%clk 0:42:13]} exd4
{[%clk 0:27:02]} 28. Nxd4 {[%clk 0:41:56]} Bxd4 {[%clk 0:26:20]} 29. cxd4
{[%clk 0:38:22]} Qc4 {[%clk 0:25:36]} 30. Rab1 {[%clk 0:36:09]} b6
{[%clk 0:19:11]} 31. a5 {[%clk 0:33:15]} bxa5 {[%clk 0:17:48]} 32. Bxa5
{[%clk 0:33:10]} Qxd4 {[%clk 0:17:03]} 33. Bc3 {[%clk 0:32:46]} Qg4
{[%clk 0:16:33]} 34. Qxg4 {[%clk 0:32:40]} hxg4 {[%clk 0:12:50]} 35. Bxf6
{[%clk 0:30:56]} Rxf6 {[%clk 0:11:50]} 36. Rb4 {[%clk 0:28:18]} Re4
{[%clk 0:11:06]} 37. Rxe4 {[%clk 0:26:31]} dxe4 {[%clk 0:11:04]} 38. Re1
{[%clk 0:26:14]} Re6 {[%clk 0:10:30]} 39. g3 {[%clk 0:25:57]} f5 {[%clk 0:07:58]}
40. Kg2 {[%clk 1:26:06]} g5 {[%clk 1:06:45]} 41. h3 {[%clk 1:26:07]} gxh3+
{[%clk 1:07:05]} 42. Kxh3 {[%clk 1:26:32]} Kg6 {[%clk 1:06:27]} 43. Kg2
{[%clk 1:25:00]} Re5 {[%clk 0:54:48]} 44. Ra1 {[%clk 1:20:21]} f4
{[%clk 0:48:26]} 45. Ra6+ {[%clk 1:11:53]} Kf5 {[%clk 0:48:06]} 46. gxf4
{[%clk 1:12:17]} gxf4 {[%clk 0:48:30]} 47. Ra8 {[%clk 1:12:23]} Rb5
{[%clk 0:45:45]} 48. Rh8 {[%clk 1:02:28]} Rb2 {[%clk 0:40:23]} 49. Rf8+
{[%clk 1:02:52]} Ke5 {[%clk 0:40:17]} 50. Re8+ {[%clk 1:03:17]} Kd4
{[%clk 0:40:29]} 51. Rf8 {[%clk 1:03:42]} Ke5 {[%clk 0:38:04]} 52. Re8+
{[%clk 1:04:02]} Kd5 {[%clk 0:37:56]} 53. Rd8+ {[%clk 1:04:27]} Ke5
{[%clk 0:38:11]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.16"]
[Round "7.1"]
[White "So, Wesley"]
[Black "Kramnik, Vladimir"]
[Result "1/2-1/2"]
[BlackElo "2809"]
[WhiteElo "2794"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:57]} Nf6 {[%clk 1:59:54]} 2. c4 {[%clk 1:59:51]} e6
{[%clk 1:59:50]} 3. Nf3 {[%clk 1:59:46]} d5 {[%clk 1:59:46]} 4. Nc3
{[%clk 1:59:42]} Be7 {[%clk 1:59:41]} 5. Bf4 {[%clk 1:59:16]} O-O
{[%clk 1:59:33]} 6. e3 {[%clk 1:59:12]} Nbd7 {[%clk 1:59:29]} 7. a3
{[%clk 1:59:00]} c5 {[%clk 1:59:13]} 8. cxd5 {[%clk 1:58:30]} Nxd5
{[%clk 1:59:06]} 9. Nxd5 {[%clk 1:58:26]} exd5 {[%clk 1:59:03]} 10. dxc5
{[%clk 1:58:20]} Nxc5 {[%clk 1:59:01]} 11. Be2 {[%clk 1:57:51]} Qb6
{[%clk 1:56:53]} 12. b4 {[%clk 1:55:16]} Ne6 {[%clk 1:54:17]} 13. Be5
{[%clk 1:55:04]} a5 {[%clk 1:53:33]} 14. O-O {[%clk 1:54:43]} axb4
{[%clk 1:51:40]} 15. axb4 {[%clk 1:54:38]} Rxa1 {[%clk 1:51:35]} 16. Bxa1
{[%clk 1:54:33]} Rd8 {[%clk 1:50:26]} 17. b5 {[%clk 1:53:18]} Bc5
{[%clk 1:47:15]} 18. Qd2 {[%clk 1:45:37]} d4 {[%clk 1:44:39]} 19. exd4
{[%clk 1:45:04]} Nxd4 {[%clk 1:43:29]} 20. Bxd4 {[%clk 1:44:57]} Bxd4
{[%clk 1:43:25]} 21. Nxd4 {[%clk 1:44:53]} Rxd4 {[%clk 1:40:16]} 22. Qe3
{[%clk 1:44:48]} Be6 {[%clk 1:05:37]} 23. Ra1 {[%clk 1:39:45]} h6
{[%clk 1:05:16]} 24. Ra8+ {[%clk 1:18:00]} Kh7 {[%clk 0:57:06]} 25. Bd3+
{[%clk 1:17:49]} g6 {[%clk 0:54:14]} 26. Ra4 {[%clk 1:17:01]} Rd6
{[%clk 0:49:37]} 27. Qxb6 {[%clk 1:16:57]} Rxb6 {[%clk 0:49:33]} 28. Rd4
{[%clk 1:16:52]} Kg7 {[%clk 0:48:31]} 29. f4 {[%clk 1:16:47]} Kf6
{[%clk 0:47:23]} 30. Kf2 {[%clk 1:16:41]} Bf5 {[%clk 0:43:37]} 31. Bc4
{[%clk 1:10:29]} Ke7 {[%clk 0:43:07]} 32. Ke3 {[%clk 1:10:24]} f6
{[%clk 0:42:10]} 33. h4 {[%clk 1:08:35]} Rd6 {[%clk 0:35:46]} 34. Rxd6
{[%clk 1:08:03]} Kxd6 {[%clk 0:35:41]} 35. Kd4 {[%clk 1:07:59]} b6
{[%clk 0:35:35]} 36. g3 {[%clk 1:07:54]} g5 {[%clk 0:35:20]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.16"]
[Round "7.2"]
[White "Adams, Michael"]
[Black "Caruana, Fabiano"]
[Result "1/2-1/2"]
[BlackElo "2823"]
[WhiteElo "2748"]
[LiveChessVersion "1.4.8"]
[ECO "A37"]

1. c4 {[%clk 1:59:57]} c5 {[%clk 1:59:23]} 2. g3 {[%clk 1:59:52]} g6
{[%clk 1:59:03]} 3. Bg2 {[%clk 1:59:45]} Bg7 {[%clk 1:58:59]} 4. Nc3
{[%clk 1:59:39]} Nc6 {[%clk 1:58:37]} 5. Nf3 {[%clk 1:59:31]} e5 {[%clk 1:58:11]}
6. O-O {[%clk 1:57:03]} d6 {[%clk 1:56:35]} 7. a3 {[%clk 1:55:43]} a5
{[%clk 1:53:47]} 8. Ne1 {[%clk 1:53:47]} Be6 {[%clk 1:53:23]} 9. d3
{[%clk 1:52:37]} Nge7 {[%clk 1:53:15]} 10. Nc2 {[%clk 1:50:43]} d5
{[%clk 1:52:45]} 11. cxd5 {[%clk 1:50:01]} Nxd5 {[%clk 1:52:39]} 12. Ne3
{[%clk 1:48:26]} Nb6 {[%clk 1:52:00]} 13. Nc4 {[%clk 1:35:14]} O-O
{[%clk 1:46:39]} 14. Bxc6 {[%clk 1:26:23]} bxc6 {[%clk 1:46:04]} 15. Nxb6
{[%clk 1:22:28]} Qxb6 {[%clk 1:45:58]} 16. Be3 {[%clk 1:22:17]} Qxb2
{[%clk 1:37:08]} 17. Na4 {[%clk 1:20:07]} Qb3 {[%clk 1:36:39]} 18. Nxc5
{[%clk 1:13:39]} Qxd1 {[%clk 1:36:19]} 19. Rfxd1 {[%clk 1:13:19]} Bd5
{[%clk 1:34:12]} 20. Rab1 {[%clk 1:08:56]} Rfb8 {[%clk 1:29:26]} 21. a4
{[%clk 0:59:53]} f5 {[%clk 1:10:30]} 22. f3 {[%clk 0:53:55]} Ba2 {[%clk 1:02:48]}
23. Rbc1 {[%clk 0:50:27]} Rb2 {[%clk 0:54:43]} 24. Kf1 {[%clk 0:44:59]} Bd5
{[%clk 0:48:17]} 25. Bd2 {[%clk 0:38:15]} Ra2 {[%clk 0:41:47]} 26. Ke1
{[%clk 0:28:24]} Bf8 {[%clk 0:37:25]} 27. Nd7 {[%clk 0:25:53]} Bb3
{[%clk 0:23:56]} 28. Ra1 {[%clk 0:25:29]} Rxa4 {[%clk 0:23:12]} 29. Rxa4
{[%clk 0:24:10]} Bxa4 {[%clk 0:23:08]} 30. Ra1 {[%clk 0:24:01]} Bb3
{[%clk 0:22:46]} 31. Rxa5 {[%clk 0:23:08]} Rxa5 {[%clk 0:22:41]} 32. Bxa5
{[%clk 0:23:05]} Bg7 {[%clk 0:19:58]} 33. Bc3 {[%clk 0:18:24]} Be6
{[%clk 0:17:33]} 34. Nxe5 {[%clk 0:16:42]} Bxe5 {[%clk 0:17:20]} 35. Bxe5
{[%clk 0:16:36]} Kf7 {[%clk 0:17:03]} 36. Kd2 {[%clk 0:14:09]} Bb3
{[%clk 0:16:37]} 37. e4 {[%clk 0:11:34]} Ke6 {[%clk 0:16:30]} 38. Bg7
{[%clk 0:10:42]} h5 {[%clk 0:15:38]} 39. Bf8 {[%clk 0:10:09]} Kf7
{[%clk 0:15:26]} 40. Bc5 {[%clk 1:09:31]} Ke6 {[%clk 1:15:51]} 41. h3
{[%clk 1:09:27]} Ba4 {[%clk 1:16:09]} 42. Ke3 {[%clk 1:05:23]} Bd1
{[%clk 1:16:30]} 43. Bb4 {[%clk 1:03:02]} Kf7 {[%clk 1:16:36]} 44. Kf4
{[%clk 1:02:40]} Ke6 {[%clk 1:16:55]} 45. g4 {[%clk 1:02:11]} fxg4
{[%clk 1:17:03]} 46. fxg4 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.16"]
[Round "7.3"]
[White "Aronian, Levon"]
[Black "Anand, Viswanathan"]
[Result "1/2-1/2"]
[BlackElo "2779"]
[WhiteElo "2785"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:56]} Nf6 {[%clk 1:59:55]} 2. c4 {[%clk 1:59:50]} e6
{[%clk 1:59:51]} 3. Nf3 {[%clk 1:59:42]} d5 {[%clk 1:59:45]} 4. Nc3
{[%clk 1:59:36]} Be7 {[%clk 1:59:39]} 5. Bf4 {[%clk 1:59:29]} O-O
{[%clk 1:59:32]} 6. e3 {[%clk 1:59:24]} c5 {[%clk 1:59:27]} 7. dxc5
{[%clk 1:58:49]} Bxc5 {[%clk 1:59:15]} 8. Bd3 {[%clk 1:54:04]} dxc4
{[%clk 1:57:03]} 9. Bxc4 {[%clk 1:53:57]} Qxd1+ {[%clk 1:56:17]} 10. Rxd1
{[%clk 1:53:49]} Bb4 {[%clk 1:55:59]} 11. Rd3 {[%clk 1:43:36]} Ne4
{[%clk 1:39:59]} 12. O-O {[%clk 1:41:07]} Bxc3 {[%clk 1:36:53]} 13. bxc3
{[%clk 1:40:57]} Nc6 {[%clk 1:31:21]} 14. Bb5 {[%clk 1:33:58]} f6
{[%clk 1:20:33]} 15. Bd6 {[%clk 1:19:36]} Rd8 {[%clk 1:11:35]} 16. Rfd1
{[%clk 1:18:32]} Rxd6 {[%clk 1:06:26]} 17. Rxd6 {[%clk 1:18:24]} Nxd6
{[%clk 1:06:22]} 18. Rxd6 {[%clk 1:18:17]} Kf7 {[%clk 1:05:59]} 19. Bxc6
{[%clk 1:18:02]} Ke7 {[%clk 1:05:54]} 20. Bxb7 {[%clk 1:17:36]} Bxb7
{[%clk 1:05:50]} 21. Rd4 {[%clk 1:17:25]} Rc8 {[%clk 1:05:22]} 22. Rb4
{[%clk 1:17:12]} Bd5 {[%clk 1:03:58]} 23. Ra4 {[%clk 1:17:08]} Rxc3
{[%clk 1:03:36]} 24. Rxa7+ {[%clk 1:17:04]} Kf8 {[%clk 1:03:25]} 25. h3
{[%clk 1:16:48]} Rc1+ {[%clk 1:03:14]} 26. Kh2 {[%clk 1:16:43]} Rc2
{[%clk 1:03:07]} 27. Kg3 {[%clk 1:16:37]} Rxa2 {[%clk 1:03:01]} 28. Rxa2
{[%clk 1:16:33]} Bxa2 {[%clk 1:02:55]} 29. Nd2 {[%clk 1:15:26]} e5
{[%clk 1:02:48]} 30. f4 {[%clk 1:15:20]} exf4+ {[%clk 1:02:42]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.16"]
[Round "7.4"]
[White "Nakamura, Hikaru"]
[Black "Vachier-Lagrave, Maxime"]
[Result "1-0"]
[BlackElo "2804"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "B96"]

1. e4 {[%clk 1:59:56]} c5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:49]} d6
{[%clk 1:59:54]} 3. d4 {[%clk 1:59:13]} cxd4 {[%clk 1:59:49]} 4. Nxd4
{[%clk 1:59:05]} Nf6 {[%clk 1:59:46]} 5. Nc3 {[%clk 1:58:58]} a6 {[%clk 1:59:44]}
6. Bg5 {[%clk 1:58:51]} e6 {[%clk 1:59:39]} 7. f4 {[%clk 1:58:45]} h6
{[%clk 1:59:29]} 8. Bh4 {[%clk 1:58:39]} Qb6 {[%clk 1:59:26]} 9. a3
{[%clk 1:58:30]} Be7 {[%clk 1:59:19]} 10. Bf2 {[%clk 1:58:20]} Qc7
{[%clk 1:59:16]} 11. Qf3 {[%clk 1:57:52]} Nbd7 {[%clk 1:58:07]} 12. O-O-O
{[%clk 1:57:34]} b5 {[%clk 1:58:03]} 13. g4 {[%clk 1:57:09]} Bb7 {[%clk 1:57:58]}
14. Bg2 {[%clk 1:56:47]} Rc8 {[%clk 1:57:03]} 15. Kb1 {[%clk 1:56:25]} g5
{[%clk 1:54:23]} 16. Qh3 {[%clk 1:53:09]} Nc5 {[%clk 1:28:05]} 17. Rhe1
{[%clk 1:34:06]} h5 {[%clk 1:06:34]} 18. Nf5 {[%clk 1:10:14]} Ncxe4
{[%clk 0:53:13]} 19. Bxe4 {[%clk 1:07:42]} Nxe4 {[%clk 0:52:17]} 20. Bd4
{[%clk 1:05:26]} Rg8 {[%clk 0:46:29]} 21. Nxe7 {[%clk 0:53:14]} Kxe7
{[%clk 0:46:11]} 22. gxh5 {[%clk 0:51:34]} gxf4 {[%clk 0:40:09]} 23. Qh4+
{[%clk 0:47:55]} Kf8 {[%clk 0:39:57]} 24. Ka1 {[%clk 0:25:48]} b4
{[%clk 0:29:58]} 25. Nxe4 {[%clk 0:18:49]} Bxe4 {[%clk 0:29:54]} 26. Rxe4
{[%clk 0:18:43]} Qxc2 {[%clk 0:29:50]} 27. Ree1 {[%clk 0:18:08]} bxa3
{[%clk 0:29:04]} 28. Qxf4 {[%clk 0:17:58]} axb2+ {[%clk 0:27:22]} 29. Bxb2
{[%clk 0:17:53]} Rg5 {[%clk 0:27:17]} 30. Qxd6+ {[%clk 0:17:17]} Kg8
{[%clk 0:27:14]} 31. Rg1 {[%clk 0:16:41]} Qa4+ {[%clk 0:25:37]} 32. Ba3
{[%clk 0:12:28]} Rxg1 {[%clk 0:25:27]} 33. Rxg1+ {[%clk 0:12:22]} Kh7
{[%clk 0:25:22]} 34. Qd3+ {[%clk 0:12:04]} Kh6 {[%clk 0:24:16]} 35. Rg6+
{[%clk 0:11:18]} Kxh5 {[%clk 0:24:12]} 36. Rg1 {[%clk 0:11:13]} f5
{[%clk 0:23:56]} 37. Qf3+ {[%clk 0:10:49]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.16"]
[Round "7.5"]
[White "Giri, Anish"]
[Black "Topalov, Veselin"]
[Result "1/2-1/2"]
[BlackElo "2760"]
[WhiteElo "2771"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. c4 Nf6 {[%clk 1:59:49]} 2. d4 {[%clk 1:59:56]} e6 {[%clk 1:59:35]} 3. Nf3
{[%clk 1:59:52]} d5 {[%clk 1:59:23]} 4. Nc3 {[%clk 1:59:45]} Be7 {[%clk 1:59:02]}
5. Bf4 {[%clk 1:59:39]} O-O {[%clk 1:58:44]} 6. e3 {[%clk 1:59:35]} Nbd7
{[%clk 1:57:51]} 7. c5 {[%clk 1:59:12]} c6 {[%clk 1:57:41]} 8. h3
{[%clk 1:58:49]} b6 {[%clk 1:57:06]} 9. b4 {[%clk 1:58:40]} a5 {[%clk 1:56:59]}
10. a3 {[%clk 1:58:36]} h6 {[%clk 1:56:49]} 11. Be2 {[%clk 1:58:31]} Ba6
{[%clk 1:56:30]} 12. O-O {[%clk 1:58:27]} Qc8 {[%clk 1:55:04]} 13. Rb1
{[%clk 1:53:43]} Bxe2 {[%clk 1:52:26]} 14. Qxe2 {[%clk 1:53:39]} axb4
{[%clk 1:51:26]} 15. axb4 {[%clk 1:53:33]} Qb7 {[%clk 1:51:08]} 16. Rfc1
{[%clk 1:53:10]} Rfc8 {[%clk 1:49:15]} 17. Ne1 {[%clk 1:47:28]} Bd8
{[%clk 1:42:01]} 18. Qd1 {[%clk 1:32:24]} Bc7 {[%clk 1:36:04]} 19. Nd3
{[%clk 1:29:55]} b5 {[%clk 1:25:29]} 20. Ra1 {[%clk 1:28:07]} Ne4
{[%clk 1:18:49]} 21. Ne2 {[%clk 1:26:52]} Bd8 {[%clk 1:15:51]} 22. f3
{[%clk 1:22:42]} Nef6 {[%clk 1:15:46]} 23. Nc3 {[%clk 1:22:22]} Nf8
{[%clk 1:03:35]} 24. Rc2 {[%clk 1:08:51]} Ng6 {[%clk 0:59:50]} 25. Rca2
{[%clk 1:08:26]} Rxa2 {[%clk 0:55:11]} 26. Rxa2 {[%clk 1:08:13]} Ra8
{[%clk 0:55:01]} 27. Qa1 {[%clk 1:06:27]} Rxa2 {[%clk 0:54:56]} 28. Qxa2
{[%clk 1:06:23]} Nxf4 {[%clk 0:45:40]} 29. exf4 {[%clk 1:05:42]} Nd7
{[%clk 0:45:29]} 30. Ne2 {[%clk 1:04:28]} Bc7 {[%clk 0:41:27]} 31. h4
{[%clk 1:03:16]} Nb8 {[%clk 0:32:35]} 32. h5 {[%clk 0:50:27]} Qa6
{[%clk 0:31:54]} 33. Qb2 {[%clk 0:50:18]} f6 {[%clk 0:29:52]} 34. g4
{[%clk 0:41:13]} Nd7 {[%clk 0:29:27]} 35. Kf2 {[%clk 0:40:49]} Qa8
{[%clk 0:27:22]} 36. Ke1 {[%clk 0:38:05]} Kf7 {[%clk 0:25:06]} 37. Kd2
{[%clk 0:33:55]} Kg8 {[%clk 0:24:27]} 38. Kd1 {[%clk 0:32:48]} Kf7
{[%clk 0:22:16]} 39. Kc2 {[%clk 0:25:52]} Qa4+ {[%clk 0:21:47]} 40. Kc1
{[%clk 1:25:45]} Qa8 {[%clk 1:21:02]} 41. Kb1 {[%clk 1:22:42]} Qa7
{[%clk 1:17:21]} 42. Qc1 {[%clk 1:16:13]} Qa8 {[%clk 1:10:04]} 43. Kb2
{[%clk 1:09:15]} Bd8 {[%clk 1:06:56]} 44. Qg1 {[%clk 1:05:54]} Be7
{[%clk 1:03:23]} 45. Nec1 {[%clk 1:04:35]} Bd8 {[%clk 1:03:06]} 46. Nb3
{[%clk 1:04:46]} Qb7 {[%clk 1:00:28]} 47. Qe3 {[%clk 1:00:25]} Qa8
{[%clk 0:51:28]} 48. Qc1 {[%clk 0:56:20]} Qa4 {[%clk 0:48:55]} 49. Qe1
{[%clk 0:54:56]} Qa8 {[%clk 0:47:50]} 50. Qd2 {[%clk 0:53:24]} Qa4
{[%clk 0:43:03]} 51. Nf2 {[%clk 0:50:52]} Qa8 {[%clk 0:38:48]} 52. Nh3
{[%clk 0:44:11]} Qc8 {[%clk 0:33:56]} 53. Qc2 {[%clk 0:37:23]} Nf8
{[%clk 0:34:08]} 54. Nc1 {[%clk 0:37:43]} Kg8 {[%clk 0:31:37]} 55. Nd3
{[%clk 0:37:52]} Nh7 {[%clk 0:28:17]} 56. Qe2 {[%clk 0:37:35]} Nf8
{[%clk 0:28:22]} 57. Qe3 {[%clk 0:36:40]} Qd7 {[%clk 0:28:30]} 58. Ng1
{[%clk 0:34:16]} Qe8 {[%clk 0:27:54]} 59. Ne2 {[%clk 0:34:01]} Bc7
{[%clk 0:26:19]} 60. Nec1 {[%clk 0:33:15]} Kf7 {[%clk 0:25:13]} 61. Nb3
{[%clk 0:32:01]} Ke7 {[%clk 0:24:49]} 62. Qe1 {[%clk 0:30:36]} Kd7
{[%clk 0:24:35]} 63. Nbc1 {[%clk 0:29:04]} Kc8 {[%clk 0:22:52]} 64. Ne2
{[%clk 0:27:30]} Nd7 {[%clk 0:22:16]} 65. Ng3 {[%clk 0:27:38]} Qf7
{[%clk 0:22:29]} 66. Qe3 {[%clk 0:27:30]} Kb7 {[%clk 0:22:34]} 67. Ne2
{[%clk 0:25:50]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.15"]
[Round "6.1"]
[White "Topalov, Veselin"]
[Black "So, Wesley"]
[Result "0-1"]
[BlackElo "2794"]
[WhiteElo "2760"]
[LiveChessVersion "1.4.8"]
[ECO "C54"]

1. e4 {[%clk 1:59:55]} e5 {[%clk 1:59:53]} 2. Nf3 {[%clk 1:59:43]} Nc6
{[%clk 1:59:40]} 3. Bc4 {[%clk 1:59:34]} Bc5 {[%clk 1:59:32]} 4. c3
{[%clk 1:59:25]} Nf6 {[%clk 1:59:26]} 5. d3 {[%clk 1:59:17]} a6 {[%clk 1:59:10]}
6. a4 {[%clk 1:56:28]} d6 {[%clk 1:58:40]} 7. Bg5 {[%clk 1:55:51]} Ba7
{[%clk 1:57:16]} 8. Nbd2 {[%clk 1:54:33]} h6 {[%clk 1:54:21]} 9. Bh4
{[%clk 1:54:25]} g5 {[%clk 1:54:16]} 10. Bg3 {[%clk 1:54:21]} O-O
{[%clk 1:54:06]} 11. O-O {[%clk 1:53:42]} Nh7 {[%clk 1:54:02]} 12. h3
{[%clk 1:37:55]} h5 {[%clk 1:45:41]} 13. d4 {[%clk 1:32:41]} exd4
{[%clk 1:29:11]} 14. Nxd4 {[%clk 1:30:18]} g4 {[%clk 1:18:41]} 15. hxg4
{[%clk 1:18:51]} hxg4 {[%clk 1:18:00]} 16. Nxc6 {[%clk 1:10:41]} bxc6
{[%clk 1:17:55]} 17. e5 {[%clk 1:10:10]} d5 {[%clk 1:02:06]} 18. Be2
{[%clk 1:06:22]} Qg5 {[%clk 0:55:13]} 19. a5 {[%clk 0:51:57]} f5 {[%clk 0:45:41]}
20. exf6 {[%clk 0:49:32]} Nxf6 {[%clk 0:45:36]} 21. Ra4 {[%clk 0:48:01]} Rf7
{[%clk 0:39:19]} 22. Re1 {[%clk 0:35:48]} Nh5 {[%clk 0:34:15]} 23. Bxg4
{[%clk 0:35:09]} Nxg3 {[%clk 0:34:08]} 24. Re8+ {[%clk 0:30:50]} Kg7
{[%clk 0:27:51]} 25. Rxc8 {[%clk 0:27:05]} Bxf2+ {[%clk 0:27:09]} 26. Kh2
{[%clk 0:26:59]} Qe5 {[%clk 0:27:06]} 27. Kh3 {[%clk 0:24:03]} Ne2 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.15"]
[Round "6.2"]
[White "Kramnik, Vladimir"]
[Black "Adams, Michael"]
[Result "1/2-1/2"]
[BlackElo "2748"]
[WhiteElo "2809"]
[LiveChessVersion "1.4.8"]
[ECO "D05"]

1. d4 {[%clk 1:59:57]} Nf6 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:48]} d5
{[%clk 1:59:28]} 3. e3 {[%clk 1:59:42]} e6 {[%clk 1:58:06]} 4. Bd3
{[%clk 1:58:35]} b6 {[%clk 1:57:24]} 5. O-O {[%clk 1:57:51]} Bb7 {[%clk 1:57:17]}
6. Nbd2 {[%clk 1:56:58]} Bd6 {[%clk 1:53:27]} 7. Qe2 {[%clk 1:54:02]} Ne4
{[%clk 1:50:30]} 8. b3 {[%clk 1:53:18]} O-O {[%clk 1:49:42]} 9. Bb2
{[%clk 1:53:02]} Nd7 {[%clk 1:47:47]} 10. c4 {[%clk 1:52:03]} a5 {[%clk 1:39:23]}
11. Rfd1 {[%clk 1:42:41]} Qe7 {[%clk 1:37:02]} 12. Rac1 {[%clk 1:36:26]} a4
{[%clk 1:29:22]} 13. Nf1 {[%clk 1:30:47]} axb3 {[%clk 1:10:18]} 14. axb3
{[%clk 1:25:58]} Ra2 {[%clk 1:09:50]} 15. Bb1 {[%clk 1:13:56]} Rxb2
{[%clk 1:09:39]} 16. Qxb2 {[%clk 1:13:50]} Ba3 {[%clk 1:09:37]} 17. Qc2
{[%clk 1:10:28]} c5 {[%clk 0:57:51]} 18. cxd5 {[%clk 1:04:27]} Bxd5
{[%clk 0:52:39]} 19. N3d2 {[%clk 0:47:09]} Ndf6 {[%clk 0:48:26]} 20. f3
{[%clk 0:43:33]} Nxd2 {[%clk 0:46:25]} 21. Nxd2 {[%clk 0:43:16]} g6
{[%clk 0:42:05]} 22. e4 {[%clk 0:33:06]} Bb7 {[%clk 0:40:59]} 23. Nc4
{[%clk 0:32:06]} Bxc1 {[%clk 0:40:33]} 24. Qxc1 {[%clk 0:32:01]} Rd8
{[%clk 0:33:37]} 25. dxc5 {[%clk 0:29:28]} Qxc5+ {[%clk 0:31:51]} 26. Kh1
{[%clk 0:29:21]} Rxd1+ {[%clk 0:24:13]} 27. Qxd1 {[%clk 0:29:19]} Kg7
{[%clk 0:21:23]} 28. Qd2 {[%clk 0:25:47]} Ba6 {[%clk 0:18:26]} 29. Ne3
{[%clk 0:25:31]} Bb5 {[%clk 0:14:31]} 30. Nc2 {[%clk 0:22:37]} h5
{[%clk 0:12:43]} 31. h4 {[%clk 0:15:06]} Nd7 {[%clk 0:11:27]} 32. b4
{[%clk 0:10:13]} Qe7 {[%clk 0:08:36]} 33. g3 {[%clk 0:10:01]} Qf6
{[%clk 0:07:22]} 34. Nd4 {[%clk 0:08:17]} e5 {[%clk 0:05:36]} 35. Nxb5
{[%clk 0:06:11]} Qxf3+ {[%clk 0:05:34]} 36. Qg2 {[%clk 0:05:24]} Qd1+
{[%clk 0:05:31]} 37. Qg1 {[%clk 0:05:22]} Qf3+ {[%clk 0:05:09]} 38. Qg2
{[%clk 0:05:16]} Qd1+ {[%clk 0:05:05]} 39. Qg1 {[%clk 0:05:12]} Qf3+
{[%clk 0:03:00]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.15"]
[Round "6.3"]
[White "Caruana, Fabiano"]
[Black "Nakamura, Hikaru"]
[Result "1-0"]
[BlackElo "2779"]
[WhiteElo "2823"]
[LiveChessVersion "1.4.8"]
[ECO "B96"]

1. e4 {[%clk 1:59:57]} c5 {[%clk 1:59:50]} 2. Nf3 {[%clk 1:59:52]} d6
{[%clk 1:59:45]} 3. d4 {[%clk 1:59:48]} cxd4 {[%clk 1:59:39]} 4. Nxd4
{[%clk 1:59:44]} Nf6 {[%clk 1:59:24]} 5. Nc3 {[%clk 1:59:39]} a6 {[%clk 1:59:19]}
6. Bg5 {[%clk 1:59:26]} e6 {[%clk 1:59:01]} 7. f4 {[%clk 1:59:15]} h6
{[%clk 1:58:56]} 8. Bh4 {[%clk 1:59:08]} Qb6 {[%clk 1:58:40]} 9. a3
{[%clk 1:58:15]} Be7 {[%clk 1:57:01]} 10. Bf2 {[%clk 1:57:06]} Qc7
{[%clk 1:56:55]} 11. Qf3 {[%clk 1:56:14]} Nbd7 {[%clk 1:55:27]} 12. O-O-O
{[%clk 1:55:28]} b5 {[%clk 1:55:14]} 13. g4 {[%clk 1:54:58]} g5 {[%clk 1:54:02]}
14. h4 {[%clk 1:53:31]} gxf4 {[%clk 1:53:00]} 15. Be2 {[%clk 1:53:03]} b4
{[%clk 1:51:04]} 16. axb4 {[%clk 1:52:37]} Ne5 {[%clk 1:50:58]} 17. Qxf4
{[%clk 1:52:17]} Nexg4 {[%clk 1:50:23]} 18. Bxg4 {[%clk 1:51:12]} e5
{[%clk 1:50:16]} 19. Qxf6 {[%clk 1:50:37]} Bxf6 {[%clk 1:50:10]} 20. Nd5
{[%clk 1:50:30]} Qd8 {[%clk 1:50:06]} 21. Nf5 {[%clk 1:49:26]} Rb8
{[%clk 1:14:47]} 22. Nxf6+ {[%clk 1:32:09]} Qxf6 {[%clk 1:13:23]} 23. Rxd6
{[%clk 1:27:37]} Be6 {[%clk 1:13:07]} 24. Rhd1 {[%clk 1:06:22]} O-O
{[%clk 0:59:57]} 25. h5 {[%clk 1:01:39]} Qg5+ {[%clk 0:59:40]} 26. Be3
{[%clk 1:01:28]} Qf6 {[%clk 0:59:38]} 27. Nxh6+ {[%clk 0:56:36]} Kh8
{[%clk 0:58:22]} 28. Bf5 {[%clk 0:34:10]} Qe7 {[%clk 0:28:19]} 29. b5
{[%clk 0:19:33]} Qe8 {[%clk 0:20:40]} 30. Nxf7+ {[%clk 0:13:56]} Rxf7
{[%clk 0:20:13]} 31. Rxe6 {[%clk 0:13:50]} Qxb5 {[%clk 0:20:08]} 32. Rh6+
{[%clk 0:12:58]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.15"]
[Round "6.4"]
[White "Anand, Viswanathan"]
[Black "Giri, Anish"]
[Result "1/2-1/2"]
[BlackElo "2771"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "B90"]

1. e4 {[%clk 1:59:57]} c5 {[%clk 1:59:58]} 2. Nf3 {[%clk 1:59:49]} d6
{[%clk 1:59:54]} 3. d4 {[%clk 1:59:43]} cxd4 {[%clk 1:59:51]} 4. Nxd4
{[%clk 1:59:36]} Nf6 {[%clk 1:59:47]} 5. Nc3 {[%clk 1:59:29]} a6 {[%clk 1:59:44]}
6. h3 {[%clk 1:59:20]} e6 {[%clk 1:59:41]} 7. g4 {[%clk 1:59:06]} Be7
{[%clk 1:59:37]} 8. g5 {[%clk 1:57:29]} Nfd7 {[%clk 1:59:29]} 9. h4
{[%clk 1:57:25]} b5 {[%clk 1:59:04]} 10. a3 {[%clk 1:56:51]} Bb7 {[%clk 1:58:58]}
11. Be3 {[%clk 1:53:22]} Nc6 {[%clk 1:58:27]} 12. Qd2 {[%clk 1:51:40]} O-O
{[%clk 1:58:13]} 13. O-O-O {[%clk 1:51:08]} Nc5 {[%clk 1:57:05]} 14. f3
{[%clk 1:42:12]} Rb8 {[%clk 1:56:57]} 15. Rg1 {[%clk 1:32:38]} Qc7
{[%clk 1:48:19]} 16. b4 {[%clk 1:23:02]} Nd7 {[%clk 1:30:36]} 17. Ndxb5
{[%clk 1:19:27]} axb5 {[%clk 1:30:15]} 18. Nxb5 {[%clk 1:19:18]} Qc8
{[%clk 1:25:12]} 19. Nxd6 {[%clk 1:12:42]} Bxd6 {[%clk 1:24:56]} 20. Qxd6
{[%clk 1:12:35]} Rd8 {[%clk 1:18:35]} 21. b5 {[%clk 0:56:35]} Nde5
{[%clk 1:13:43]} 22. Qc5 {[%clk 0:56:16]} Rxd1+ {[%clk 1:13:25]} 23. Kxd1
{[%clk 0:56:10]} Nxf3 {[%clk 1:12:48]} 24. bxc6 {[%clk 0:50:28]} Bxc6
{[%clk 1:11:19]} 25. Rg3 {[%clk 0:42:22]} Rb1+ {[%clk 1:05:04]} 26. Ke2
{[%clk 0:41:09]} Qa6+ {[%clk 0:39:53]} 27. Kxf3 {[%clk 0:40:17]} Qxf1+
{[%clk 0:35:21]} 28. Bf2 {[%clk 0:40:03]} Qh1+ {[%clk 0:27:09]} 29. Ke3
{[%clk 0:39:30]} Qc1+ {[%clk 0:21:20]} 30. Kf3 {[%clk 0:37:24]} Qd1+
{[%clk 0:20:47]} 31. Ke3 {[%clk 0:37:18]} Qc1+ {[%clk 0:19:07]} 32. Kf3
{[%clk 0:37:04]} Qh1+ {[%clk 0:19:05]} 33. Ke3 {[%clk 0:36:53]} Qxe4+
{[%clk 0:18:59]} 34. Kd2 {[%clk 0:36:47]} Qf4+ {[%clk 0:17:54]} 35. Kc3
{[%clk 0:33:48]} Rb8 {[%clk 0:11:29]} 36. Rd3 {[%clk 0:32:24]} Rc8
{[%clk 0:10:33]} 37. Kb2 {[%clk 0:30:21]} h5 {[%clk 0:10:08]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.15"]
[Round "6.5"]
[White "Vachier-Lagrave, Maxime"]
[Black "Aronian, Levon"]
[Result "1-0"]
[BlackElo "2785"]
[WhiteElo "2804"]
[LiveChessVersion "1.4.8"]
[ECO "C50"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:53]} Nc6
{[%clk 1:59:50]} 3. Bc4 {[%clk 1:59:50]} Bc5 {[%clk 1:59:41]} 4. O-O
{[%clk 1:59:45]} Nf6 {[%clk 1:59:36]} 5. d3 {[%clk 1:59:43]} O-O {[%clk 1:59:26]}
6. a4 {[%clk 1:59:40]} a5 {[%clk 1:59:08]} 7. c3 {[%clk 1:59:01]} d5
{[%clk 1:59:01]} 8. exd5 {[%clk 1:58:25]} Nxd5 {[%clk 1:58:56]} 9. Re1
{[%clk 1:49:21]} Bg4 {[%clk 1:58:45]} 10. Nbd2 {[%clk 1:48:35]} Nb6
{[%clk 1:58:37]} 11. Bb5 {[%clk 1:44:33]} Bd6 {[%clk 1:58:30]} 12. h3
{[%clk 1:40:05]} Bh5 {[%clk 1:58:05]} 13. Ne4 {[%clk 1:37:34]} f5
{[%clk 1:57:57]} 14. Ng3 {[%clk 1:34:01]} Bxf3 {[%clk 1:57:43]} 15. Qxf3
{[%clk 1:33:20]} Ne7 {[%clk 1:57:38]} 16. Bg5 {[%clk 1:24:08]} c6
{[%clk 1:51:18]} 17. Bc4+ {[%clk 1:23:52]} Nxc4 {[%clk 1:50:52]} 18. dxc4
{[%clk 1:23:45]} e4 {[%clk 1:19:29]} 19. Nxe4 {[%clk 1:21:03]} fxe4
{[%clk 1:19:24]} 20. Qxe4 {[%clk 1:20:57]} Rf7 {[%clk 1:18:25]} 21. Rad1
{[%clk 1:19:24]} Qc7 {[%clk 1:17:56]} 22. Rxd6 {[%clk 1:18:24]} Qxd6
{[%clk 1:16:23]} 23. Bxe7 {[%clk 1:18:08]} Qd2 {[%clk 1:15:47]} 24. Bc5
{[%clk 1:17:17]} h6 {[%clk 1:15:38]} 25. Qe2 {[%clk 1:12:46]} Rd8
{[%clk 1:13:18]} 26. Bd4 {[%clk 1:11:50]} Qg5 {[%clk 1:02:37]} 27. Qg4
{[%clk 1:00:31]} Re7 {[%clk 0:59:07]} 28. Rxe7 {[%clk 0:56:42]} Qxe7
{[%clk 0:58:51]} 29. Qf5 {[%clk 0:54:59]} Re8 {[%clk 0:55:10]} 30. Qxa5
{[%clk 0:52:05]} Qf7 {[%clk 0:54:18]} 31. Kh2 {[%clk 0:46:34]} Qf4+
{[%clk 0:50:01]} 32. g3 {[%clk 0:46:18]} Qf7 {[%clk 0:49:55]} 33. Kg2
{[%clk 0:37:36]} Re1 {[%clk 0:47:15]} 34. g4 {[%clk 0:35:14]} Rd1
{[%clk 0:31:06]} 35. Qe5 {[%clk 0:31:34]} Qg6 {[%clk 0:21:47]} 36. b4
{[%clk 0:27:45]} b6 {[%clk 0:14:47]} 37. Bxb6 {[%clk 0:24:04]} c5
{[%clk 0:08:34]} 38. Bxc5 {[%clk 0:23:10]} Qc6+ {[%clk 0:08:29]} 39. f3
{[%clk 0:21:09]} Rd3 {[%clk 0:06:15]} 40. Qb8+ {[%clk 1:21:04]} Kh7
{[%clk 1:06:10]} 41. Qf4 {[%clk 1:21:28]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.13"]
[Round "5.1"]
[White "So, Wesley"]
[Black "Anand, Viswanathan"]
[Result "1/2-1/2"]
[BlackElo "2779"]
[WhiteElo "2794"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:57]} Nf6 {[%clk 1:59:53]} 2. c4 {[%clk 1:59:50]} e6
{[%clk 1:59:48]} 3. Nf3 {[%clk 1:59:47]} d5 {[%clk 1:59:42]} 4. Nc3
{[%clk 1:59:43]} Nbd7 {[%clk 1:59:35]} 5. Bf4 {[%clk 1:59:37]} dxc4
{[%clk 1:59:07]} 6. e3 {[%clk 1:59:32]} b5 {[%clk 1:58:41]} 7. Nxb5
{[%clk 1:59:26]} Bb4+ {[%clk 1:58:32]} 8. Nc3 {[%clk 1:59:21]} Nd5
{[%clk 1:57:49]} 9. a3 {[%clk 1:59:12]} Nxc3 {[%clk 1:57:34]} 10. Qd2
{[%clk 1:59:07]} Bxa3 {[%clk 1:57:17]} 11. Qxc3 {[%clk 1:27:43]} Bd6
{[%clk 1:55:56]} 12. Bxd6 {[%clk 1:23:40]} cxd6 {[%clk 1:55:47]} 13. Bxc4
{[%clk 1:23:36]} O-O {[%clk 1:53:45]} 14. O-O {[%clk 1:23:00]} Bb7
{[%clk 1:52:29]} 15. Be2 {[%clk 1:22:55]} Qb6 {[%clk 1:48:21]} 16. Rfc1
{[%clk 1:21:10]} Rfc8 {[%clk 1:41:56]} 17. Qa3 {[%clk 1:21:04]} Bxf3
{[%clk 1:36:21]} 18. Bxf3 {[%clk 1:20:58]} Rab8 {[%clk 1:34:53]} 19. h4
{[%clk 1:13:18]} Rxc1+ {[%clk 1:33:22]} 20. Rxc1 {[%clk 1:13:13]} Qxb2
{[%clk 1:32:35]} 21. Qxb2 {[%clk 1:13:10]} Rxb2 {[%clk 1:32:28]} 22. Rc7
{[%clk 1:13:07]} Nf8 {[%clk 1:32:16]} 23. Rxa7 {[%clk 1:13:02]} d5
{[%clk 1:32:08]} 24. Ra8 {[%clk 1:12:54]} g6 {[%clk 1:31:53]} 25. g3
{[%clk 1:12:47]} h5 {[%clk 1:31:48]} 26. g4 {[%clk 1:12:27]} hxg4
{[%clk 1:31:43]} 27. Bxg4 {[%clk 1:12:25]} Kg7 {[%clk 1:31:35]} 28. h5
{[%clk 1:12:20]} gxh5 {[%clk 1:31:31]} 29. Bxh5 {[%clk 1:12:16]} Ng6
{[%clk 1:31:24]} 30. Bxg6 {[%clk 1:12:14]} Kxg6 {[%clk 1:31:17]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.13"]
[Round "5.2"]
[White "Vachier-Lagrave, Maxime"]
[Black "Caruana, Fabiano"]
[Result "1/2-1/2"]
[BlackElo "2823"]
[WhiteElo "2804"]
[LiveChessVersion "1.4.8"]
[ECO "C42"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:54]} 2. Nf3 {[%clk 1:59:54]} Nf6
{[%clk 1:59:48]} 3. Nxe5 {[%clk 1:58:58]} d6 {[%clk 1:59:42]} 4. Nf3
{[%clk 1:58:54]} Nxe4 {[%clk 1:59:38]} 5. Nc3 {[%clk 1:58:15]} Nxc3
{[%clk 1:59:31]} 6. dxc3 {[%clk 1:58:12]} Be7 {[%clk 1:59:23]} 7. Be3
{[%clk 1:58:07]} Nc6 {[%clk 1:59:13]} 8. Qd2 {[%clk 1:57:55]} Be6
{[%clk 1:59:04]} 9. O-O-O {[%clk 1:57:20]} Qd7 {[%clk 1:58:57]} 10. b3
{[%clk 1:56:46]} O-O-O {[%clk 1:57:58]} 11. Nd4 {[%clk 1:51:17]} a6
{[%clk 1:57:39]} 12. Nxe6 {[%clk 1:50:38]} fxe6 {[%clk 1:57:33]} 13. g3
{[%clk 1:50:03]} d5 {[%clk 1:53:21]} 14. Bh3 {[%clk 1:47:20]} Kb8
{[%clk 1:50:50]} 15. Rhe1 {[%clk 1:45:28]} Rhe8 {[%clk 1:47:30]} 16. f4
{[%clk 1:32:46]} Bf6 {[%clk 1:35:19]} 17. Kb1 {[%clk 1:27:23]} Qd6
{[%clk 1:31:43]} 18. Qd3 {[%clk 1:23:49]} e5 {[%clk 1:25:46]} 19. Bc1
{[%clk 0:59:07]} e4 {[%clk 1:21:22]} 20. Qd2 {[%clk 0:58:51]} Qc5
{[%clk 0:54:12]} 21. Bb2 {[%clk 0:58:38]} d4 {[%clk 0:53:45]} 22. Qe2
{[%clk 0:57:29]} dxc3 {[%clk 0:51:48]} 23. Rxd8+ {[%clk 0:57:11]} Rxd8
{[%clk 0:49:16]} 24. Bc1 {[%clk 0:57:04]} Rd2 {[%clk 0:43:55]} 25. Bxd2
{[%clk 0:44:38]} cxd2 {[%clk 0:43:49]} 26. Qxd2 {[%clk 0:44:35]} Bc3
{[%clk 0:32:34]} 27. Qc1 {[%clk 0:41:54]} Bxe1 {[%clk 0:29:20]} 28. Qxe1
{[%clk 0:41:46]} e3 {[%clk 0:28:18]} 29. c3 {[%clk 0:40:25]} Na7 {[%clk 0:26:24]}
30. Bf1 {[%clk 0:35:51]} Nb5 {[%clk 0:24:46]} 31. Kb2 {[%clk 0:34:20]} Qa3+
{[%clk 0:17:52]} 32. Kb1 {[%clk 0:33:53]} Qc5 {[%clk 0:17:43]} 33. Kb2
{[%clk 0:33:49]} Qa3+ {[%clk 0:17:03]} 34. Kb1 {[%clk 0:33:42]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.13"]
[Round "5.3"]
[White "Nakamura, Hikaru"]
[Black "Kramnik, Vladimir"]
[Result "1/2-1/2"]
[BlackElo "2809"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:43]} Nf6 {[%clk 1:59:53]} 2. c4 {[%clk 1:59:31]} e6
{[%clk 1:59:50]} 3. Nf3 {[%clk 1:59:20]} d5 {[%clk 1:59:43]} 4. Nc3
{[%clk 1:59:07]} Be7 {[%clk 1:59:32]} 5. Bf4 {[%clk 1:58:43]} O-O
{[%clk 1:59:23]} 6. e3 {[%clk 1:58:40]} Nbd7 {[%clk 1:59:18]} 7. c5
{[%clk 1:58:23]} Nh5 {[%clk 1:59:05]} 8. Bd3 {[%clk 1:58:02]} Nxf4
{[%clk 1:58:50]} 9. exf4 {[%clk 1:57:56]} b6 {[%clk 1:58:47]} 10. b4
{[%clk 1:57:39]} a5 {[%clk 1:58:40]} 11. a3 {[%clk 1:57:34]} c6 {[%clk 1:58:31]}
12. O-O {[%clk 1:57:24]} Ba6 {[%clk 1:58:22]} 13. Re1 {[%clk 1:56:33]} Bf6
{[%clk 1:57:28]} 14. Ne5 {[%clk 1:54:36]} Bxe5 {[%clk 1:56:32]} 15. fxe5
{[%clk 1:54:28]} Bxd3 {[%clk 1:56:28]} 16. Qxd3 {[%clk 1:54:20]} Ra7
{[%clk 1:54:18]} 17. g3 {[%clk 1:36:10]} Qa8 {[%clk 1:48:13]} 18. Rab1
{[%clk 1:34:47]} axb4 {[%clk 1:44:16]} 19. axb4 {[%clk 1:34:14]} Ra3
{[%clk 1:42:27]} 20. Qc2 {[%clk 1:30:55]} Rb8 {[%clk 1:31:53]} 21. h4
{[%clk 1:24:03]} h6 {[%clk 1:29:59]} 22. Kg2 {[%clk 1:20:45]} Qa6
{[%clk 1:21:09]} 23. Rec1 {[%clk 1:02:41]} bxc5 {[%clk 1:10:54]} 24. bxc5
{[%clk 1:02:35]} Rxb1 {[%clk 1:10:35]} 25. Qxb1 {[%clk 1:02:14]} Qc4
{[%clk 1:08:12]} 26. Qb2 {[%clk 0:59:38]} Rb3 {[%clk 1:04:19]} 27. Qd2
{[%clk 0:59:25]} Qb4 {[%clk 0:58:11]} 28. Rc2 {[%clk 0:58:17]} f6
{[%clk 0:52:19]} 29. f4 {[%clk 0:57:24]} fxe5 {[%clk 0:48:16]} 30. fxe5
{[%clk 0:57:03]} Nf8 {[%clk 0:36:32]} 31. Ne2 {[%clk 0:52:08]} Qb7
{[%clk 0:27:56]} 32. Nf4 {[%clk 0:47:50]} Qf7 {[%clk 0:17:13]} 33. Rb2
{[%clk 0:46:47]} Rxb2 {[%clk 0:16:00]} 34. Qxb2 {[%clk 0:46:40]} g5
{[%clk 0:12:08]} 35. hxg5 {[%clk 0:46:22]} hxg5 {[%clk 0:12:06]} 36. Nd3
{[%clk 0:41:12]} Ng6 {[%clk 0:08:46]} 37. Nf2 {[%clk 0:40:10]} Ne7
{[%clk 0:06:02]} 38. Qd2 {[%clk 0:38:07]} Qg6 {[%clk 0:05:05]} 39. g4
{[%clk 0:37:42]} Kg7 {[%clk 0:04:00]} 40. Nh3 {[%clk 1:35:56]} Kh6
{[%clk 1:03:37]} 41. Kg3 {[%clk 1:35:53]} Nc8 {[%clk 0:54:15]} 42. Qf2
{[%clk 1:17:18]} Kg7 {[%clk 0:53:13]} 43. Qe3 {[%clk 1:17:31]} Kh6
{[%clk 0:52:54]} 44. Qf3 {[%clk 1:14:04]} Kg7 {[%clk 0:52:33]} 45. Qa3
{[%clk 0:43:45]} Qe4 {[%clk 0:43:57]} 46. Nxg5 {[%clk 0:34:43]} Qe1+
{[%clk 0:44:21]} 47. Kf4 {[%clk 0:34:44]} Qf2+ {[%clk 0:40:55]} 48. Nf3
{[%clk 0:35:09]} Ne7 {[%clk 0:40:57]} 49. Qa7 {[%clk 0:30:56]} Kf8
{[%clk 0:40:03]} 50. Qb8+ {[%clk 0:24:40]} Kf7 {[%clk 0:40:05]} 51. Qb7
{[%clk 0:24:46]} Kf8 {[%clk 0:38:12]} 52. Qd7 {[%clk 0:21:20]} Ng6+
{[%clk 0:35:50]} 53. Kg5 {[%clk 0:21:45]} Qxf3 {[%clk 0:36:08]} 54. Qxe6
{[%clk 0:21:20]} Nh8 {[%clk 0:29:45]} 55. Qf5+ {[%clk 0:21:18]} Nf7+
{[%clk 0:27:30]} 56. Kf6 {[%clk 0:21:06]} Qxf5+ {[%clk 0:27:54]} 57. gxf5
{[%clk 0:20:29]} Nd8 {[%clk 0:28:18]} 58. e6 {[%clk 0:12:43]} Nf7
{[%clk 0:28:36]} 59. Kg6 {[%clk 0:08:21]} Nd8 {[%clk 0:28:51]} 60. Kf6
{[%clk 0:08:48]} Nf7 {[%clk 0:29:16]} 61. exf7 {[%clk 0:09:15]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.13"]
[Round "5.4"]
[White "Aronian, Levon"]
[Black "Giri, Anish"]
[Result "1/2-1/2"]
[BlackElo "2771"]
[WhiteElo "2785"]
[LiveChessVersion "1.4.8"]
[ECO "A06"]

1. g3 {[%clk 1:59:55]} d5 {[%clk 1:59:31]} 2. Nf3 {[%clk 1:59:49]} g6
{[%clk 1:59:29]} 3. Bg2 {[%clk 1:59:43]} Bg7 {[%clk 1:59:25]} 4. d4
{[%clk 1:59:38]} Nf6 {[%clk 1:59:22]} 5. O-O {[%clk 1:59:31]} O-O
{[%clk 1:59:20]} 6. c4 {[%clk 1:59:26]} dxc4 {[%clk 1:59:11]} 7. Na3
{[%clk 1:59:19]} c5 {[%clk 1:59:10]} 8. Nxc4 {[%clk 1:55:11]} Be6
{[%clk 1:58:26]} 9. b3 {[%clk 1:53:26]} Nc6 {[%clk 1:58:09]} 10. Bb2
{[%clk 1:53:01]} cxd4 {[%clk 1:57:49]} 11. Nxd4 {[%clk 1:52:04]} Nxd4
{[%clk 1:57:43]} 12. Bxd4 {[%clk 1:46:39]} b6 {[%clk 1:57:29]} 13. Rc1
{[%clk 1:41:25]} Rc8 {[%clk 1:49:30]} 14. Rc2 {[%clk 1:33:37]} b5
{[%clk 1:42:33]} 15. Ne3 {[%clk 1:33:32]} Rxc2 {[%clk 1:37:41]} 16. Nxc2
{[%clk 1:33:05]} Qa5 {[%clk 1:33:46]} 17. Qa1 {[%clk 1:32:41]} Qd2
{[%clk 1:27:06]} 18. Qd1 {[%clk 1:32:35]} Qa5 {[%clk 1:26:51]} 19. Qa1
{[%clk 1:32:30]} Qd2 {[%clk 1:26:38]} 20. Qd1 {[%clk 1:32:07]} Qa5
{[%clk 1:26:33]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.13"]
[Round "5.5"]
[White "Adams, Michael"]
[Black "Topalov, Veselin"]
[Result "1-0"]
[BlackElo "2760"]
[WhiteElo "2748"]
[LiveChessVersion "1.4.8"]
[ECO "C65"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:53]} Nc6
{[%clk 1:59:51]} 3. Bb5 {[%clk 1:59:49]} Nf6 {[%clk 1:59:46]} 4. d3
{[%clk 1:59:43]} Bc5 {[%clk 1:59:38]} 5. Bxc6 {[%clk 1:59:36]} dxc6
{[%clk 1:59:33]} 6. Nbd2 {[%clk 1:59:29]} Be6 {[%clk 1:58:46]} 7. O-O
{[%clk 1:59:21]} Bd6 {[%clk 1:53:22]} 8. d4 {[%clk 1:58:44]} Nd7 {[%clk 1:52:44]}
9. Nxe5 {[%clk 1:57:25]} Nxe5 {[%clk 1:52:04]} 10. dxe5 {[%clk 1:57:19]} Bxe5
{[%clk 1:52:01]} 11. f4 {[%clk 1:57:10]} Bd4+ {[%clk 1:47:22]} 12. Kh1
{[%clk 1:57:02]} f6 {[%clk 1:45:15]} 13. c3 {[%clk 1:54:33]} Bb6 {[%clk 1:41:55]}
14. f5 {[%clk 1:45:59]} Bf7 {[%clk 1:41:20]} 15. e5 {[%clk 1:43:08]} fxe5
{[%clk 1:34:58]} 16. Qg4 {[%clk 1:41:46]} Qd3 {[%clk 1:00:39]} 17. Qxg7
{[%clk 1:38:49]} Rg8 {[%clk 0:59:23]} 18. Qxe5+ {[%clk 1:37:28]} Kd7
{[%clk 0:46:08]} 19. Qe4 {[%clk 1:31:19]} Qa6 {[%clk 0:43:07]} 20. f6
{[%clk 1:07:26]} Rae8 {[%clk 0:35:30]} 21. Qf5+ {[%clk 1:05:13]} Kd8
{[%clk 0:34:38]} 22. c4 {[%clk 0:56:30]} Qa5 {[%clk 0:20:20]} 23. Qh3
{[%clk 0:47:50]} Qb4 {[%clk 0:09:48]} 24. Qxh7 {[%clk 0:35:19]} Qf8
{[%clk 0:05:09]} 25. b3 {[%clk 0:22:31]} Bd4 {[%clk 0:04:17]} 26. Qd3
{[%clk 0:21:49]} Qd6 {[%clk 0:04:06]} 27. Ne4 {[%clk 0:15:08]} Qd7
{[%clk 0:02:15]} 28. Rd1 {[%clk 0:12:19]} Kc8 {[%clk 0:01:37]} 29. Qxd4
{[%clk 0:07:56]} Qg4 {[%clk 0:01:28]} 30. Bg5 {[%clk 0:05:34]} Rxe4
{[%clk 0:00:27]} 31. Qxa7 {[%clk 0:05:26]} Bd5 {[%clk 0:00:09]} 32. Qa8+
{[%clk 0:04:36]} Kd7 {[%clk 0:00:06]} 33. Rxd5+ {[%clk 0:04:29]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.12"]
[Round "4.1"]
[White "Giri, Anish"]
[Black "So, Wesley"]
[Result "1/2-1/2"]
[BlackElo "2794"]
[WhiteElo "2771"]
[LiveChessVersion "1.4.8"]
[ECO "D02"]

1. d4 {[%clk 1:59:58]} Nf6 {[%clk 1:59:52]} 2. Nf3 {[%clk 1:59:54]} d5
{[%clk 1:59:43]} 3. Bf4 {[%clk 1:58:51]} c5 {[%clk 1:58:38]} 4. e3
{[%clk 1:58:10]} Nc6 {[%clk 1:58:32]} 5. Nbd2 {[%clk 1:58:00]} e6
{[%clk 1:58:26]} 6. c3 {[%clk 1:57:30]} cxd4 {[%clk 1:55:10]} 7. exd4
{[%clk 1:53:33]} Nh5 {[%clk 1:55:02]} 8. Bg5 {[%clk 1:42:54]} f6 {[%clk 1:49:17]}
9. Be3 {[%clk 1:39:05]} Bd6 {[%clk 1:48:52]} 10. g3 {[%clk 1:35:16]} O-O
{[%clk 1:46:07]} 11. Bg2 {[%clk 1:34:28]} f5 {[%clk 1:32:22]} 12. Ne5
{[%clk 1:28:08]} f4 {[%clk 1:31:07]} 13. Qxh5 {[%clk 0:57:57]} fxe3
{[%clk 1:30:14]} 14. fxe3 {[%clk 0:57:52]} Nxe5 {[%clk 1:29:08]} 15. dxe5
{[%clk 0:56:49]} Bc5 {[%clk 1:28:50]} 16. Rf1 {[%clk 0:55:14]} Bxe3
{[%clk 1:21:00]} 17. Rxf8+ {[%clk 0:48:42]} Qxf8 {[%clk 1:20:52]} 18. Qf3
{[%clk 0:47:53]} Qxf3 {[%clk 1:14:16]} 19. Nxf3 {[%clk 0:47:42]} Bd7
{[%clk 1:14:13]} 20. Rd1 {[%clk 0:42:32]} Rf8 {[%clk 1:06:51]} 21. c4
{[%clk 0:39:24]} Bc6 {[%clk 1:04:50]} 22. Nd4 {[%clk 0:37:26]} Bxd4
{[%clk 1:02:42]} 23. Rxd4 {[%clk 0:37:17]} Rf5 {[%clk 1:02:37]} 24. g4
{[%clk 0:25:33]} Rxe5+ {[%clk 1:02:17]} 25. Kf2 {[%clk 0:25:24]} Kf7
{[%clk 0:59:04]} 26. b4 {[%clk 0:23:53]} Ke7 {[%clk 0:49:46]} 27. b5
{[%clk 0:23:05]} Bd7 {[%clk 0:49:37]} 28. b6 {[%clk 0:22:23]} dxc4
{[%clk 0:46:23]} 29. Rxc4 {[%clk 0:18:52]} axb6 {[%clk 0:45:43]} 30. Rc7
{[%clk 0:17:22]} Rb5 {[%clk 0:40:35]} 31. Rxb7 {[%clk 0:17:13]} Kd6
{[%clk 0:40:30]} 32. Kg3 {[%clk 0:16:45]} h6 {[%clk 0:37:33]} 33. Rb8
{[%clk 0:15:18]} Rb2 {[%clk 0:36:21]} 34. Bf3 {[%clk 0:14:46]} b5
{[%clk 0:15:51]} 35. a4 {[%clk 0:14:12]} b4 {[%clk 0:13:55]} 36. a5
{[%clk 0:14:02]} Rb3 {[%clk 0:07:41]} 37. Kg2 {[%clk 0:13:58]} Bc6
{[%clk 0:02:50]} 38. Bxc6 {[%clk 0:13:33]} Kxc6 {[%clk 0:02:47]} 39. a6
{[%clk 0:13:27]} Ra3 {[%clk 0:02:42]} 40. Rxb4 {[%clk 1:13:52]} Rxa6
{[%clk 1:02:57]} 41. h4 {[%clk 1:08:21]} e5 {[%clk 0:56:18]} 42. Kf3
{[%clk 1:06:22]} Kd5 {[%clk 0:56:43]} 43. Rb5+ {[%clk 1:06:13]} Ke6
{[%clk 0:57:06]} 44. Rb7 {[%clk 1:06:37]} Kf6 {[%clk 0:57:24]} 45. g5+
{[%clk 1:05:55]} hxg5 {[%clk 0:57:47]} 46. hxg5+ {[%clk 1:06:23]} Kg6
{[%clk 0:58:12]} 47. Re7 {[%clk 1:06:10]} Ra5 {[%clk 0:58:06]} 48. Ke3
{[%clk 1:03:26]} Rb5 {[%clk 0:57:07]} 49. Kf3 {[%clk 1:03:26]} Rb3+
{[%clk 0:57:00]} 50. Kf2 {[%clk 1:03:32]} Rb5 {[%clk 0:57:26]} 51. Kf3
{[%clk 1:03:59]} Rd5 {[%clk 0:57:52]} 52. Ke3 {[%clk 1:04:00]} e4
{[%clk 0:58:17]} 53. Kxe4 {[%clk 1:04:18]} Rxg5 {[%clk 0:58:43]} 54. Kf3
{[%clk 1:04:37]} Kh5 {[%clk 0:59:08]} 55. Re1 {[%clk 1:04:49]} Rg4
{[%clk 0:59:32]} 56. Rh1+ {[%clk 1:04:47]} Kg5 {[%clk 0:59:56]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.12"]
[Round "4.2"]
[White "Kramnik, Vladimir"]
[Black "Vachier-Lagrave, Maxime"]
[Result "1/2-1/2"]
[BlackElo "2804"]
[WhiteElo "2809"]
[LiveChessVersion "1.4.8"]
[ECO "A49"]

1. d4 {[%clk 1:59:57]} Nf6 {[%clk 1:59:55]} 2. Nf3 {[%clk 1:59:48]} g6
{[%clk 1:59:49]} 3. g3 {[%clk 1:59:45]} Bg7 {[%clk 1:59:29]} 4. Bg2
{[%clk 1:59:37]} d5 {[%clk 1:59:20]} 5. O-O {[%clk 1:59:29]} O-O {[%clk 1:59:17]}
6. Nbd2 {[%clk 1:59:25]} Nc6 {[%clk 1:52:30]} 7. b3 {[%clk 1:58:52]} e5
{[%clk 1:42:31]} 8. dxe5 {[%clk 1:58:40]} Ng4 {[%clk 1:41:54]} 9. c4
{[%clk 1:58:34]} d4 {[%clk 1:28:30]} 10. Ne4 {[%clk 1:57:56]} Ngxe5
{[%clk 1:28:16]} 11. Nxe5 {[%clk 1:57:38]} Nxe5 {[%clk 1:28:01]} 12. Bg5
{[%clk 1:57:09]} f6 {[%clk 1:23:33]} 13. Bc1 {[%clk 1:57:03]} f5 {[%clk 1:16:43]}
14. Nc5 {[%clk 1:56:00]} c6 {[%clk 1:16:19]} 15. Bb2 {[%clk 1:51:12]} Qd6
{[%clk 1:09:33]} 16. e3 {[%clk 1:48:25]} Nxc4 {[%clk 0:51:36]} 17. Bxd4
{[%clk 1:33:10]} Bxd4 {[%clk 0:51:28]} 18. Qxd4 {[%clk 1:27:44]} Qxd4
{[%clk 0:51:23]} 19. exd4 {[%clk 1:27:40]} Nd6 {[%clk 0:49:33]} 20. Rfd1
{[%clk 1:19:17]} Nb5 {[%clk 0:44:08]} 21. d5 {[%clk 1:12:15]} Nc3
{[%clk 0:43:47]} 22. dxc6 {[%clk 1:07:18]} Nxd1 {[%clk 0:43:42]} 23. Bd5+
{[%clk 1:06:22]} Kh8 {[%clk 0:43:38]} 24. cxb7 {[%clk 1:06:16]} Bxb7
{[%clk 0:43:35]} 25. Bxb7 {[%clk 1:06:09]} Rad8 {[%clk 0:42:06]} 26. Ne6
{[%clk 1:04:06]} Rfe8 {[%clk 0:39:16]} 27. Nxd8 {[%clk 1:03:24]} Rxd8
{[%clk 0:39:13]} 28. Kf1 {[%clk 0:57:56]} Nc3 {[%clk 0:37:30]} 29. a3
{[%clk 0:47:59]} Rb8 {[%clk 0:33:10]} 30. Rc1 {[%clk 0:45:55]} Nb5
{[%clk 0:33:07]} 31. Rc8+ {[%clk 0:45:40]} Rxc8 {[%clk 0:32:40]} 32. Bxc8
{[%clk 0:45:38]} Nxa3 {[%clk 0:32:27]} 33. Ke2 {[%clk 0:45:26]} Nb5
{[%clk 0:32:20]} 34. Kd3 {[%clk 0:45:13]} Kg7 {[%clk 0:32:15]} 35. Bd7
{[%clk 0:38:10]} Nd6 {[%clk 0:31:30]} 36. f3 {[%clk 0:33:17]} Kf6
{[%clk 0:31:13]} 37. Kd4 {[%clk 0:32:59]} Nf7 {[%clk 0:22:30]} 38. Bb5
{[%clk 0:25:13]} Ne5 {[%clk 0:19:25]} 39. Be2 {[%clk 0:24:07]} g5
{[%clk 0:14:51]} 40. Kd5 {[%clk 1:21:02]} h5 {[%clk 1:12:10]} 41. b4
{[%clk 1:17:12]} Ng6 {[%clk 0:56:44]} 42. b5 {[%clk 0:39:41]} f4 {[%clk 0:56:21]}
43. g4 {[%clk 0:38:00]} hxg4 {[%clk 0:56:46]} 44. fxg4 {[%clk 0:38:27]} Ne5
{[%clk 0:54:44]} 45. h3 {[%clk 0:35:14]} f3 {[%clk 0:54:14]} 46. Bf1
{[%clk 0:34:11]} f2 {[%clk 0:54:10]} 47. Ke4 {[%clk 0:33:39]} Ng6
{[%clk 0:54:09]} 48. Ke3 {[%clk 0:31:19]} Ke5 {[%clk 0:54:34]} 49. Bg2
{[%clk 0:30:02]} Nf8 {[%clk 0:53:07]} 50. Kxf2 {[%clk 0:29:34]} Kf4
{[%clk 0:53:32]} 51. Ke2 {[%clk 0:25:45]} Kg3 {[%clk 0:53:35]} 52. Bf1
{[%clk 0:22:24]} Ne6 {[%clk 0:53:58]} 53. Ke3 {[%clk 0:22:19]} Nf4
{[%clk 0:54:25]} 54. Ke4 {[%clk 0:22:12]} Nxh3 {[%clk 0:54:51]} 55. Kf5
{[%clk 0:20:20]} Nf2 {[%clk 0:55:17]} 56. Kxg5 {[%clk 0:20:04]} Nxg4
{[%clk 0:55:41]} 57. Be2 {[%clk 0:20:27]} Ne3 {[%clk 0:56:00]} 58. Kf6
{[%clk 0:20:45]} Nd5+ {[%clk 0:56:24]} 59. Ke5 {[%clk 0:21:10]} Nc3
{[%clk 0:56:49]} 60. Bc4 {[%clk 0:21:36]} Nxb5 {[%clk 0:57:16]} 61. Bxb5
{[%clk 0:22:02]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.12"]
[Round "4.3"]
[White "Caruana, Fabiano"]
[Black "Aronian, Levon"]
[Result "1/2-1/2"]
[BlackElo "2785"]
[WhiteElo "2823"]
[LiveChessVersion "1.4.8"]
[ECO "C77"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:52]} Nc6
{[%clk 1:59:51]} 3. Bb5 {[%clk 1:59:47]} a6 {[%clk 1:59:46]} 4. Ba4
{[%clk 1:59:44]} Nf6 {[%clk 1:59:40]} 5. d3 {[%clk 1:59:38]} b5 {[%clk 1:59:06]}
6. Bb3 {[%clk 1:59:32]} Be7 {[%clk 1:59:02]} 7. a4 {[%clk 1:56:13]} b4
{[%clk 1:58:18]} 8. Nbd2 {[%clk 1:54:44]} Bc5 {[%clk 1:58:10]} 9. Nf1
{[%clk 1:49:32]} d6 {[%clk 1:57:02]} 10. Ng3 {[%clk 1:48:20]} Nd4
{[%clk 1:45:36]} 11. Nxd4 {[%clk 1:45:39]} Bxd4 {[%clk 1:45:32]} 12. O-O
{[%clk 1:37:40]} O-O {[%clk 1:39:52]} 13. Rb1 {[%clk 1:18:44]} Rb8
{[%clk 1:34:00]} 14. c3 {[%clk 1:10:44]} Ba7 {[%clk 1:33:53]} 15. d4
{[%clk 1:04:28]} Be6 {[%clk 1:26:55]} 16. Bxe6 {[%clk 0:49:37]} fxe6
{[%clk 1:26:49]} 17. Be3 {[%clk 0:49:20]} bxc3 {[%clk 1:26:19]} 18. bxc3
{[%clk 0:38:31]} Rxb1 {[%clk 1:26:07]} 19. Qxb1 {[%clk 0:38:27]} Ng4
{[%clk 1:25:45]} 20. h3 {[%clk 0:32:42]} Nxe3 {[%clk 1:23:51]} 21. fxe3
{[%clk 0:32:30]} Qg5 {[%clk 1:22:30]} 22. Kh2 {[%clk 0:28:42]} a5
{[%clk 1:08:21]} 23. Rxf8+ {[%clk 0:20:17]} Kxf8 {[%clk 1:08:12]} 24. Qb7
{[%clk 0:13:31]} Bb6 {[%clk 1:07:58]} 25. Qc8+ {[%clk 0:13:20]} Kf7
{[%clk 1:07:14]} 26. Qd7+ {[%clk 0:12:20]} Qe7 {[%clk 1:07:07]} 27. Qb5
{[%clk 0:11:47]} g6 {[%clk 1:04:18]} 28. Nf1 {[%clk 0:09:33]} Qg5
{[%clk 1:02:34]} 29. Nd2 {[%clk 0:08:18]} Qxe3 {[%clk 1:01:04]} 30. Qd7+
{[%clk 0:08:13]} Kf8 {[%clk 1:00:46]} 31. Qd8+ {[%clk 0:08:09]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.12"]
[Round "4.4"]
[White "Anand, Viswanathan"]
[Black "Adams, Michael"]
[Result "1/2-1/2"]
[BlackElo "2748"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "C54"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:51]} Nc6
{[%clk 1:59:52]} 3. Bc4 {[%clk 1:59:44]} Bc5 {[%clk 1:59:45]} 4. c3
{[%clk 1:59:33]} Nf6 {[%clk 1:59:39]} 5. d3 {[%clk 1:59:27]} d6 {[%clk 1:59:14]}
6. O-O {[%clk 1:59:11]} h6 {[%clk 1:59:05]} 7. Re1 {[%clk 1:58:49]} O-O
{[%clk 1:58:54]} 8. Nbd2 {[%clk 1:58:33]} Ne7 {[%clk 1:50:13]} 9. Bb3
{[%clk 1:46:10]} Ng6 {[%clk 1:47:21]} 10. d4 {[%clk 1:41:07]} Bb6
{[%clk 1:45:59]} 11. Nc4 {[%clk 1:40:44]} Be6 {[%clk 1:39:58]} 12. h3
{[%clk 1:31:18]} c6 {[%clk 1:30:40]} 13. dxe5 {[%clk 1:26:04]} dxe5
{[%clk 1:18:52]} 14. Ncxe5 {[%clk 1:16:09]} Nxe5 {[%clk 1:12:40]} 15. Nxe5
{[%clk 1:15:56]} Re8 {[%clk 1:12:29]} 16. Qxd8 {[%clk 1:12:29]} Raxd8
{[%clk 1:12:23]} 17. Bc2 {[%clk 1:11:53]} g5 {[%clk 1:02:09]} 18. Nf3
{[%clk 1:04:46]} g4 {[%clk 0:49:29]} 19. Nd4 {[%clk 0:57:02]} gxh3
{[%clk 0:47:57]} 20. gxh3 {[%clk 0:54:51]} Bxh3 {[%clk 0:41:13]} 21. Re3
{[%clk 0:47:12]} Bg4 {[%clk 0:38:52]} 22. Rg3 {[%clk 0:39:22]} Bc7
{[%clk 0:37:42]} 23. f4 {[%clk 0:32:47]} h5 {[%clk 0:30:58]} 24. e5
{[%clk 0:32:29]} Nd5 {[%clk 0:29:20]} 25. Bf5 {[%clk 0:29:31]} Bb6
{[%clk 0:23:29]} 26. Bxg4 {[%clk 0:27:13]} hxg4 {[%clk 0:23:23]} 27. Rxg4+
{[%clk 0:27:07]} Kf8 {[%clk 0:23:04]} 28. Bd2 {[%clk 0:25:03]} Ke7
{[%clk 0:16:05]} 29. Kf2 {[%clk 0:20:48]} Nxc3 {[%clk 0:13:43]} 30. bxc3
{[%clk 0:20:33]} Rxd4 {[%clk 0:13:39]} 31. cxd4 {[%clk 0:20:20]} Bxd4+
{[%clk 0:13:35]} 32. Be3 {[%clk 0:19:15]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.12"]
[Round "4.5"]
[White "Topalov, Veselin"]
[Black "Nakamura, Hikaru"]
[Result "0-1"]
[BlackElo "2779"]
[WhiteElo "2760"]
[LiveChessVersion "1.4.8"]
[ECO "B12"]

1. e4 {[%clk 1:59:56]} c6 {[%clk 1:59:54]} 2. d4 {[%clk 1:59:47]} d5
{[%clk 1:59:45]} 3. e5 {[%clk 1:59:40]} c5 {[%clk 1:59:41]} 4. dxc5
{[%clk 1:59:32]} Nc6 {[%clk 1:59:28]} 5. Nf3 {[%clk 1:57:21]} Bg4
{[%clk 1:58:55]} 6. c3 {[%clk 1:56:29]} e6 {[%clk 1:58:14]} 7. b4
{[%clk 1:50:26]} a6 {[%clk 1:52:51]} 8. Nbd2 {[%clk 1:44:09]} Nxe5
{[%clk 1:49:59]} 9. Qa4+ {[%clk 1:37:50]} Nd7 {[%clk 1:44:17]} 10. Ne5
{[%clk 1:34:22]} Ngf6 {[%clk 1:42:43]} 11. c4 {[%clk 1:20:02]} a5
{[%clk 1:30:15]} 12. Nb3 {[%clk 1:16:58]} axb4 {[%clk 1:29:13]} 13. Qb5
{[%clk 1:16:41]} Be7 {[%clk 1:27:25]} 14. c6 {[%clk 1:05:52]} bxc6
{[%clk 1:23:46]} 15. Nxc6 {[%clk 1:05:36]} Qc7 {[%clk 1:23:00]} 16. f3
{[%clk 0:59:29]} Bf5 {[%clk 1:20:18]} 17. Nxe7 {[%clk 0:49:17]} Rb8
{[%clk 1:06:28]} 18. Nxf5 {[%clk 0:48:22]} Rxb5 {[%clk 1:05:51]} 19. Nxg7+
{[%clk 0:48:13]} Ke7 {[%clk 0:52:55]} 20. cxb5 {[%clk 0:47:55]} Nc5
{[%clk 0:52:53]} 21. Bb2 {[%clk 0:40:31]} Nxb3 {[%clk 0:42:58]} 22. axb3
{[%clk 0:40:24]} Qf4 {[%clk 0:42:55]} 23. Be2 {[%clk 0:26:32]} Rc8
{[%clk 0:42:10]} 24. Rd1 {[%clk 0:21:11]} Qg5 {[%clk 0:38:17]} 25. b6
{[%clk 0:17:27]} Rc2 {[%clk 0:19:35]} 26. Bxf6+ {[%clk 0:11:41]} Qxf6
{[%clk 0:19:29]} 27. Nh5 {[%clk 0:10:24]} Qc3+ {[%clk 0:18:17]} 28. Kf1
{[%clk 0:10:19]} Qe3 {[%clk 0:14:07]} 29. Re1 {[%clk 0:09:58]} Qxb6
{[%clk 0:14:02]} 30. Nf4 {[%clk 0:09:27]} Qe3 {[%clk 0:12:50]} 31. g3
{[%clk 0:08:48]} Qxb3 {[%clk 0:12:38]} 32. Kg2 {[%clk 0:04:52]} Kf8
{[%clk 0:06:59]} 33. Kh3 {[%clk 0:04:44]} Qb2 {[%clk 0:05:19]} 34. Rb1
{[%clk 0:03:01]} Qf6 {[%clk 0:04:50]} 35. Rhe1 {[%clk 0:02:42]} e5
{[%clk 0:03:56]} 36. Nxd5 {[%clk 0:01:00]} Qe6+ {[%clk 0:03:43]} 37. Kg2
{[%clk 0:00:52]} Qxd5 {[%clk 0:03:01]} 38. Rxb4 {[%clk 0:00:45]} Qd2
{[%clk 0:02:33]} 39. Rb8+ {[%clk 0:00:42]} Kg7 {[%clk 0:02:29]} 40. Kf1
{[%clk 1:00:39]} Qh6 {[%clk 1:01:45]} 41. Kg2 {[%clk 0:58:08]} e4
{[%clk 0:57:15]} 42. Rb3 {[%clk 0:52:44]} Qe6 {[%clk 0:51:27]} 43. Re3
{[%clk 0:51:38]} exf3+ {[%clk 0:51:15]} 44. Kxf3 {[%clk 0:51:27]} Qh3
{[%clk 0:51:38]} 45. Rd1 {[%clk 0:40:54]} Qh5+ {[%clk 0:51:16]} 46. Kf2
{[%clk 0:39:46]} Qxh2+ {[%clk 0:51:41]} 47. Kf3 {[%clk 0:40:04]} Rc6
{[%clk 0:50:29]} 48. Rd4 {[%clk 0:37:55]} Rg6 {[%clk 0:50:46]} 49. g4
{[%clk 0:36:25]} Rf6+ {[%clk 0:50:28]} 50. Ke4 {[%clk 0:36:37]} Qh1+
{[%clk 0:47:31]} 51. Kd3 {[%clk 0:36:57]} Qb1+ {[%clk 0:47:41]} 52. Kd2
{[%clk 0:37:02]} Qb2+ {[%clk 0:47:14]} 53. Kd3 {[%clk 0:37:27]} Rc6
{[%clk 0:47:02]} 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.11"]
[Round "3.1"]
[White "Aronian, Levon"]
[Black "So, Wesley"]
[Result "1/2-1/2"]
[BlackElo "2794"]
[WhiteElo "2785"]
[LiveChessVersion "1.4.8"]
[ECO "A34"]

1. c4 {[%clk 1:59:56]} c5 {[%clk 1:59:44]} 2. Nf3 {[%clk 1:59:49]} Nf6
{[%clk 1:59:39]} 3. Nc3 {[%clk 1:59:19]} d5 {[%clk 1:59:34]} 4. cxd5
{[%clk 1:58:26]} Nxd5 {[%clk 1:59:28]} 5. e4 {[%clk 1:57:57]} Nb4
{[%clk 1:59:23]} 6. Bc4 {[%clk 1:57:29]} Nd3+ {[%clk 1:59:11]} 7. Ke2
{[%clk 1:57:24]} Nf4+ {[%clk 1:59:06]} 8. Kf1 {[%clk 1:57:20]} Nd3
{[%clk 1:59:02]} 9. Qe2 {[%clk 1:56:45]} Nxc1 {[%clk 1:58:55]} 10. Rxc1
{[%clk 1:56:41]} e6 {[%clk 1:58:52]} 11. h4 {[%clk 1:54:12]} a6 {[%clk 1:58:43]}
12. e5 {[%clk 1:51:46]} Nc6 {[%clk 1:57:42]} 13. Rh3 {[%clk 1:50:41]} b5
{[%clk 1:56:34]} 14. Bd3 {[%clk 1:49:26]} Bb7 {[%clk 1:55:57]} 15. Be4
{[%clk 1:41:12]} Qd7 {[%clk 1:55:15]} 16. Rg3 {[%clk 1:29:35]} g6
{[%clk 1:54:07]} 17. Kg1 {[%clk 1:21:15]} Be7 {[%clk 1:42:30]} 18. Qe3
{[%clk 1:11:06]} O-O-O {[%clk 1:39:46]} 19. Rg4 {[%clk 1:01:04]} Kb8
{[%clk 1:37:54]} 20. Rf4 {[%clk 0:59:27]} Rhf8 {[%clk 1:36:41]} 21. a4
{[%clk 0:53:38]} b4 {[%clk 1:27:09]} 22. Bxc6 {[%clk 0:45:51]} Bxc6
{[%clk 0:33:27]} 23. Ne4 {[%clk 0:45:14]} Bxe4 {[%clk 0:29:46]} 24. Rxe4
{[%clk 0:43:46]} a5 {[%clk 0:29:36]} 25. Rec4 {[%clk 0:35:25]} Qxa4
{[%clk 0:25:20]} 26. d4 {[%clk 0:35:11]} Rd5 {[%clk 0:23:07]} 27. dxc5
{[%clk 0:34:51]} Qc6 {[%clk 0:20:44]} 28. Nd4 {[%clk 0:20:27]} Qc7
{[%clk 0:20:38]} 29. Qf3 {[%clk 0:19:48]} Rfd8 {[%clk 0:16:51]} 30. Nb5
{[%clk 0:14:03]} Qxe5 {[%clk 0:16:46]} 31. c6 {[%clk 0:13:46]} Rc8
{[%clk 0:16:34]} 32. Qxf7 {[%clk 0:04:00]} Qf6 {[%clk 0:13:55]} 33. Rf4
{[%clk 0:03:59]} Qxf7 {[%clk 0:10:58]} 34. Rxf7 {[%clk 0:03:56]} Rxb5
{[%clk 0:10:45]} 35. Rxe7 {[%clk 0:03:54]} Rc7 {[%clk 0:10:37]} 36. Rxe6
{[%clk 0:03:48]} Ka7 {[%clk 0:10:35]} 37. Kf1 {[%clk 0:01:34]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.11"]
[Round "3.2"]
[White "Caruana, Fabiano"]
[Black "Kramnik, Vladimir"]
[Result "1/2-1/2"]
[BlackElo "2809"]
[WhiteElo "2823"]
[LiveChessVersion "1.4.8"]
[ECO "C54"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:54]} 2. Nf3 {[%clk 1:59:53]} Nc6
{[%clk 1:59:48]} 3. Bc4 {[%clk 1:59:49]} Bc5 {[%clk 1:59:40]} 4. c3
{[%clk 1:59:43]} Nf6 {[%clk 1:59:31]} 5. d3 {[%clk 1:59:38]} O-O {[%clk 1:59:17]}
6. a4 {[%clk 1:59:09]} d5 {[%clk 1:57:52]} 7. exd5 {[%clk 1:59:00]} Nxd5
{[%clk 1:57:47]} 8. a5 {[%clk 1:58:42]} a6 {[%clk 1:53:15]} 9. O-O
{[%clk 1:58:19]} b5 {[%clk 1:41:13]} 10. axb6 {[%clk 1:57:59]} Nxb6
{[%clk 1:40:40]} 11. Bb3 {[%clk 1:57:42]} Bf5 {[%clk 1:35:15]} 12. Bc2
{[%clk 1:49:43]} Qd7 {[%clk 1:22:04]} 13. Qe2 {[%clk 1:44:33]} Rfd8
{[%clk 1:12:39]} 14. Nxe5 {[%clk 1:21:22]} Qe6 {[%clk 1:10:27]} 15. d4
{[%clk 1:16:35]} Bxc2 {[%clk 1:10:15]} 16. Qxc2 {[%clk 1:16:27]} Bxd4
{[%clk 1:06:00]} 17. Nf3 {[%clk 1:06:13]} Be5 {[%clk 1:04:51]} 18. Bg5
{[%clk 0:54:34]} f6 {[%clk 1:03:01]} 19. Be3 {[%clk 0:48:49]} Nc4
{[%clk 1:00:42]} 20. Re1 {[%clk 0:47:54]} Rab8 {[%clk 0:56:04]} 21. Bc1
{[%clk 0:47:13]} a5 {[%clk 0:48:44]} 22. Ra4 {[%clk 0:43:38]} Qd5
{[%clk 0:42:44]} 23. Nbd2 {[%clk 0:38:39]} Nb6 {[%clk 0:41:10]} 24. Rae4
{[%clk 0:27:11]} a4 {[%clk 0:37:01]} 25. Rh4 {[%clk 0:15:58]} Qd3
{[%clk 0:36:07]} 26. Qxd3 {[%clk 0:15:51]} Rxd3 {[%clk 0:36:02]} 27. Nc4
{[%clk 0:15:16]} Nxc4 {[%clk 0:27:19]} 28. Rxc4 {[%clk 0:14:42]} a3
{[%clk 0:27:12]} 29. Rxc6 {[%clk 0:12:13]} axb2 {[%clk 0:26:53]} 30. Bxb2
{[%clk 0:12:08]} Rxb2 {[%clk 0:26:49]} 31. Nxe5 {[%clk 0:11:48]} fxe5
{[%clk 0:26:43]} 32. Rxc7 {[%clk 0:11:30]} Rdd2 {[%clk 0:24:40]} 33. Rc8+
{[%clk 0:09:53]} Kf7 {[%clk 0:24:34]} 34. Rc7+ {[%clk 0:09:50]} Kf6
{[%clk 0:24:02]} 35. Rf1 {[%clk 0:08:16]} h6 {[%clk 0:21:14]} 36. h4
{[%clk 0:06:34]} e4 {[%clk 0:11:53]} 37. h5 {[%clk 0:05:32]} Rb5 {[%clk 0:09:27]}
38. Ra1 {[%clk 0:03:40]} Rd6 {[%clk 0:09:25]} 39. Kf1 {[%clk 0:01:36]} Rxh5
{[%clk 0:07:37]} 40. Raa7 {[%clk 1:01:28]} Rh1+ {[%clk 1:05:52]} 41. Ke2
{[%clk 1:01:53]} g5 {[%clk 1:03:29]} 42. Rf7+ {[%clk 0:56:32]} Kg6
{[%clk 1:03:24]} 43. g4 {[%clk 0:56:13]} Rdd1 {[%clk 1:03:22]} 44. Rg7+
{[%clk 0:56:36]} Kf6 {[%clk 1:03:49]} 45. Rgf7+ {[%clk 0:56:58]} Kg6
{[%clk 1:04:14]} 46. Rg7+ {[%clk 0:57:25]} Kf6 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.11"]
[Round "3.3"]
[White "Nakamura, Hikaru"]
[Black "Anand, Viswanathan"]
[Result "1-0"]
[BlackElo "2779"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "D37"]

1. d4 {[%clk 1:59:54]} Nf6 {[%clk 1:59:50]} 2. c4 {[%clk 1:59:40]} e6
{[%clk 1:59:43]} 3. Nf3 {[%clk 1:59:21]} d5 {[%clk 1:59:34]} 4. Nc3
{[%clk 1:59:14]} Nbd7 {[%clk 1:59:25]} 5. cxd5 {[%clk 1:58:47]} exd5
{[%clk 1:59:15]} 6. Bg5 {[%clk 1:58:41]} Bb4 {[%clk 1:58:59]} 7. e3
{[%clk 1:58:08]} h6 {[%clk 1:58:45]} 8. Bh4 {[%clk 1:57:59]} g5 {[%clk 1:58:38]}
9. Bg3 {[%clk 1:57:53]} Ne4 {[%clk 1:58:31]} 10. Nd2 {[%clk 1:57:47]} Nxg3
{[%clk 1:58:07]} 11. hxg3 {[%clk 1:57:22]} c6 {[%clk 1:57:59]} 12. a3
{[%clk 1:57:15]} Ba5 {[%clk 1:57:30]} 13. Bd3 {[%clk 1:57:04]} Kf8
{[%clk 1:56:59]} 14. Qc2 {[%clk 1:56:56]} Nf6 {[%clk 1:56:01]} 15. O-O-O
{[%clk 1:56:42]} Kg7 {[%clk 1:54:44]} 16. Kb1 {[%clk 1:56:32]} Be6
{[%clk 1:47:50]} 17. Nb3 {[%clk 1:52:30]} Bb6 {[%clk 1:40:35]} 18. f4
{[%clk 1:38:48]} Bg4 {[%clk 1:31:29]} 19. Rde1 {[%clk 1:17:24]} Qd6
{[%clk 1:17:36]} 20. Rhf1 {[%clk 0:55:04]} Rae8 {[%clk 1:10:56]} 21. Nc5
{[%clk 0:36:04]} Re7 {[%clk 1:01:10]} 22. Qd2 {[%clk 0:34:09]} Rhe8
{[%clk 0:39:23]} 23. fxg5 {[%clk 0:32:26]} hxg5 {[%clk 0:39:16]} 24. e4
{[%clk 0:30:22]} Nxe4 {[%clk 0:39:00]} 25. N5xe4 {[%clk 0:26:42]} dxe4
{[%clk 0:38:47]} 26. Rxe4 {[%clk 0:26:38]} Rxe4 {[%clk 0:27:37]} 27. Nxe4
{[%clk 0:26:33]} Qg6 {[%clk 0:22:46]} 28. Nf6 {[%clk 0:19:55]} Qxf6
{[%clk 0:22:39]} 29. Rxf6 {[%clk 0:19:51]} Kxf6 {[%clk 0:22:32]} 30. Qc3
{[%clk 0:19:10]} Bd7 {[%clk 0:13:48]} 31. d5+ {[%clk 0:18:31]} Re5
{[%clk 0:13:40]} 32. Be4 {[%clk 0:18:16]} g4 {[%clk 0:08:32]} 33. dxc6
{[%clk 0:15:02]} bxc6 {[%clk 0:08:18]} 34. Bxc6 {[%clk 0:14:26]} Bxc6
{[%clk 0:06:45]} 35. Qxc6+ {[%clk 0:14:19]} Kg5 {[%clk 0:06:34]} 36. Qd7
{[%clk 0:06:43]} Re3 {[%clk 0:04:53]} 37. Qxf7 {[%clk 0:03:32]} Rxg3
{[%clk 0:04:48]} 38. Qd5+ {[%clk 0:02:50]} Kh4 {[%clk 0:04:32]} 39. a4
{[%clk 0:02:43]} Bf2 {[%clk 0:03:34]} 40. Qd8+ {[%clk 1:02:37]} Kh5
{[%clk 1:03:56]} 41. Qe8+ {[%clk 1:00:48]} Kg5 {[%clk 1:04:18]} 42. Qe5+
{[%clk 1:01:11]} Kg6 {[%clk 1:04:41]} 43. Qf4 {[%clk 1:01:34]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.11"]
[Round "3.4"]
[White "Vachier-Lagrave, Maxime"]
[Black "Topalov, Veselin"]
[Result "1/2-1/2"]
[BlackElo "2760"]
[WhiteElo "2804"]
[LiveChessVersion "1.4.8"]
[ECO "C67"]

1. e4 {[%clk 1:59:57]} e5 {[%clk 1:59:54]} 2. Nf3 {[%clk 1:59:54]} Nc6
{[%clk 1:59:49]} 3. Bb5 {[%clk 1:59:52]} Nf6 {[%clk 1:59:31]} 4. O-O
{[%clk 1:57:57]} Nxe4 {[%clk 1:58:28]} 5. Re1 {[%clk 1:57:07]} Nd6
{[%clk 1:58:14]} 6. Nxe5 {[%clk 1:57:04]} Be7 {[%clk 1:58:02]} 7. Bf1
{[%clk 1:57:00]} Nf5 {[%clk 1:54:22]} 8. Nf3 {[%clk 1:56:16]} O-O
{[%clk 1:54:13]} 9. d4 {[%clk 1:55:57]} d5 {[%clk 1:54:09]} 10. g3
{[%clk 1:55:21]} Re8 {[%clk 1:51:16]} 11. Nc3 {[%clk 1:52:41]} Be6
{[%clk 1:51:08]} 12. Ne2 {[%clk 1:49:01]} g5 {[%clk 1:51:00]} 13. h3
{[%clk 1:37:58]} h6 {[%clk 1:42:13]} 14. Bg2 {[%clk 1:22:13]} Ng7
{[%clk 1:32:39]} 15. Ne5 {[%clk 1:17:42]} f6 {[%clk 1:16:40]} 16. Nxc6
{[%clk 1:12:25]} bxc6 {[%clk 1:16:34]} 17. c4 {[%clk 1:12:17]} Qd7
{[%clk 1:13:14]} 18. Kh2 {[%clk 1:12:07]} Bb4 {[%clk 1:01:43]} 19. Bd2
{[%clk 1:00:14]} Bxd2 {[%clk 1:00:34]} 20. Qxd2 {[%clk 1:00:09]} dxc4
{[%clk 1:00:29]} 21. Nc3 {[%clk 0:58:23]} Bd5 {[%clk 0:59:44]} 22. Ne4
{[%clk 0:55:57]} Qf7 {[%clk 0:57:31]} 23. Qa5 {[%clk 0:53:58]} f5
{[%clk 0:42:52]} 24. Nc3 {[%clk 0:53:51]} Bxg2 {[%clk 0:42:45]} 25. Kxg2
{[%clk 0:53:45]} f4 {[%clk 0:42:39]} 26. Qc5 {[%clk 0:38:31]} fxg3
{[%clk 0:40:16]} 27. fxg3 {[%clk 0:38:26]} Rxe1 {[%clk 0:34:35]} 28. Rxe1
{[%clk 0:38:16]} Rf8 {[%clk 0:34:24]} 29. d5 Nh5 30. Rg1 {[%clk 0:18:29]} cxd5
{[%clk 0:13:49]} 31. Qxd5 {[%clk 0:15:28]} Qxd5+ {[%clk 0:11:42]} 32. Nxd5
{[%clk 0:15:19]} Rd8 {[%clk 0:10:05]} 33. Rd1 {[%clk 0:13:36]} Kg7
{[%clk 0:09:43]} 34. Kf3 c6 {[%clk 0:07:42]} 35. Ne3 {[%clk 0:10:38]} Rd3
{[%clk 0:07:30]} 36. Rxd3 {[%clk 0:10:19]} cxd3 {[%clk 0:07:24]} 37. Nf1
{[%clk 0:10:15]} Kf6 {[%clk 0:05:59]} 38. Ke3 {[%clk 0:09:59]} Ke5
{[%clk 0:05:39]} 39. Kxd3 {[%clk 0:09:53]} Nf6 {[%clk 0:05:10]} 40. Ne3
{[%clk 1:09:37]} h5 {[%clk 1:04:48]} 41. Nc4+ {[%clk 1:08:26]} Kd5
{[%clk 1:04:54]} 42. Ne3+ {[%clk 1:08:53]} Ke5 {[%clk 1:05:18]} 43. Nc4+
{[%clk 1:09:20]} Kd5 {[%clk 1:05:42]} 44. Ne3+ {[%clk 1:09:46]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.11"]
[Round "3.5"]
[White "Adams, Michael"]
[Black "Giri, Anish"]
[Result "1/2-1/2"]
[BlackElo "2771"]
[WhiteElo "2748"]
[LiveChessVersion "1.4.8"]
[ECO "B51"]

1. e4 {[%clk 1:59:56]} c5 {[%clk 1:59:58]} 2. Nf3 {[%clk 1:59:51]} d6
{[%clk 1:59:54]} 3. Bb5+ {[%clk 1:59:47]} Nd7 {[%clk 1:59:50]} 4. d4
{[%clk 1:59:41]} cxd4 {[%clk 1:59:35]} 5. Qxd4 {[%clk 1:59:34]} a6
{[%clk 1:59:22]} 6. Bxd7+ {[%clk 1:59:27]} Bxd7 {[%clk 1:59:01]} 7. Nc3
{[%clk 1:59:20]} e5 {[%clk 1:57:45]} 8. Qd3 {[%clk 1:59:12]} Rc8 {[%clk 1:55:17]}
9. O-O {[%clk 1:58:53]} h6 {[%clk 1:45:27]} 10. Nd2 {[%clk 1:57:50]} Qc7
{[%clk 1:45:07]} 11. Rd1 {[%clk 1:56:56]} Bg4 {[%clk 1:44:51]} 12. f3
{[%clk 1:54:50]} Be6 {[%clk 1:44:47]} 13. Nf1 {[%clk 1:52:10]} Nf6
{[%clk 1:43:21]} 14. Ne3 {[%clk 1:49:43]} Be7 {[%clk 1:43:12]} 15. a4
{[%clk 1:48:15]} O-O {[%clk 1:43:04]} 16. Bd2 {[%clk 1:47:55]} Rfd8
{[%clk 1:42:57]} 17. Be1 {[%clk 1:25:30]} d5 {[%clk 1:40:31]} 18. Nexd5
{[%clk 1:08:51]} Bxd5 {[%clk 1:35:24]} 19. exd5 {[%clk 1:08:25]} Bb4
{[%clk 1:28:39]} 20. Kh1 {[%clk 1:03:43]} Bxc3 {[%clk 1:14:11]} 21. Qxc3
{[%clk 0:53:06]} Qxc3 {[%clk 1:09:02]} 22. Bxc3 {[%clk 0:51:56]} Nxd5
{[%clk 1:05:52]} 23. Bxe5 {[%clk 0:48:20]} Ne3 {[%clk 1:04:16]} 24. Rxd8+
{[%clk 0:43:53]} Rxd8 {[%clk 1:04:14]} 25. Rc1 {[%clk 0:33:03]} f6
{[%clk 0:54:28]} 26. Bc3 {[%clk 0:25:12]} Nxc2 {[%clk 0:51:32]} 27. Kg1
{[%clk 0:23:27]} Nd4 {[%clk 0:41:55]} 28. Kf2 {[%clk 0:20:31]} Nb3
{[%clk 0:39:26]} 29. Re1 {[%clk 0:17:12]} Nc5 {[%clk 0:33:35]} 30. Re7
{[%clk 0:16:57]} b6 {[%clk 0:30:43]} 31. a5 {[%clk 0:14:56]} bxa5
{[%clk 0:30:36]} 32. Bxa5 {[%clk 0:12:17]} Rb8 {[%clk 0:30:28]} 33. Bc3
{[%clk 0:08:19]} Nd3+ {[%clk 0:30:03]} 34. Ke2 {[%clk 0:06:56]} Nxb2
{[%clk 0:29:44]} 35. Re4 {[%clk 0:05:26]} Rc8 {[%clk 0:29:18]} 36. Bxb2
{[%clk 0:04:02]} Rc2+ {[%clk 0:29:09]} 37. Ke3 {[%clk 0:03:47]} Rxb2
{[%clk 0:28:57]} 38. g4 {[%clk 0:03:43]} Rb3+ {[%clk 0:22:26]} 39. Kf4
{[%clk 0:02:57]} Kf7 {[%clk 0:16:54]} 40. Ra4 {[%clk 1:03:01]} Rb6
{[%clk 1:17:21]} 41. h4 {[%clk 1:02:00]} g6 {[%clk 1:08:16]} 42. h5
{[%clk 0:52:59]} g5+ {[%clk 1:07:54]} 43. Ke4 {[%clk 0:48:33]} Re6+
{[%clk 1:07:43]} 44. Kd4 {[%clk 0:47:30]} Ke7 {[%clk 1:06:01]} 45. Ra5
{[%clk 0:43:25]} Kd7 {[%clk 1:05:15]} 46. Kc4 {[%clk 0:37:23]} Kc7
{[%clk 1:01:57]} 47. Kb4 {[%clk 0:36:11]} Rc6 {[%clk 0:56:57]} 48. Rf5
{[%clk 0:31:11]} Re6 {[%clk 0:46:35]} 49. Kc4 {[%clk 0:30:34]} Kb7
{[%clk 0:43:50]} 50. Kb4 {[%clk 0:29:58]} Kb6 {[%clk 0:43:54]} 51. Rd5
{[%clk 0:29:14]} Rc6 {[%clk 0:43:32]} 52. Rf5 {[%clk 0:28:01]} Rd6
{[%clk 0:37:55]} 53. Kc4 {[%clk 0:28:04]} a5 {[%clk 0:33:16]} 54. Kb3
{[%clk 0:28:18]} Ka6 {[%clk 0:27:36]} 55. Kb2 {[%clk 0:23:53]} Rb6+
{[%clk 0:26:40]} 56. Ka3 {[%clk 0:24:13]} Rc6 {[%clk 0:19:19]} 57. Kb2
{[%clk 0:24:08]} Kb6 {[%clk 0:18:48]} 58. Kb3 {[%clk 0:24:25]} Rd6
{[%clk 0:19:14]} 59. Kb2 {[%clk 0:22:22]} Ka6 {[%clk 0:15:07]} 60. Kb3
{[%clk 0:22:21]} Rb6+ {[%clk 0:15:32]} 61. Ka3 {[%clk 0:22:39]} Kb7
{[%clk 0:13:30]} 62. Ka4 {[%clk 0:22:23]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.09"]
[Round "1.1"]
[White "Nakamura, Hikaru"]
[Black "So, Wesley"]
[Result "0-1"]
[BlackElo "2794"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "D85"]

1. d4 {[%clk 1:59:54]} Nf6 {[%clk 1:59:53]} 2. c4 {[%clk 1:59:45]} g6
{[%clk 1:59:49]} 3. Nc3 {[%clk 1:59:26]} d5 {[%clk 1:59:44]} 4. cxd5
{[%clk 1:59:22]} Nxd5 {[%clk 1:59:40]} 5. e4 {[%clk 1:58:56]} Nxc3
{[%clk 1:59:35]} 6. bxc3 {[%clk 1:58:52]} Bg7 {[%clk 1:59:31]} 7. Be3
{[%clk 1:58:41]} c5 {[%clk 1:59:24]} 8. Rc1 {[%clk 1:58:35]} O-O {[%clk 1:58:51]}
9. Qd2 {[%clk 1:58:30]} e5 {[%clk 1:58:06]} 10. d5 {[%clk 1:58:16]} Nd7
{[%clk 1:55:52]} 11. c4 {[%clk 1:52:16]} f5 {[%clk 1:54:07]} 12. Bg5
{[%clk 1:52:08]} Nf6 {[%clk 1:50:49]} 13. Ne2 {[%clk 1:51:43]} Nxe4
{[%clk 1:35:23]} 14. Bxd8 {[%clk 1:51:19]} Nxd2 {[%clk 1:35:18]} 15. Be7
{[%clk 1:41:04]} Rf7 {[%clk 1:34:52]} 16. Bxc5 {[%clk 1:21:31]} Nxf1
{[%clk 1:34:34]} 17. Rxf1 {[%clk 0:56:25]} b6 {[%clk 1:34:19]} 18. Bb4
{[%clk 0:52:53]} Ba6 {[%clk 1:33:57]} 19. f4 {[%clk 0:52:22]} Rc8
{[%clk 1:29:11]} 20. fxe5 {[%clk 0:50:36]} Bxe5 {[%clk 1:24:33]} 21. Rf3
{[%clk 0:50:30]} Bxc4 {[%clk 1:17:11]} 22. Re3 {[%clk 0:48:03]} Bg7
{[%clk 1:15:08]} 23. Nf4 {[%clk 0:46:01]} Rd7 {[%clk 1:04:51]} 24. a4
{[%clk 0:34:40]} Bh6 {[%clk 0:43:04]} 25. g3 {[%clk 0:34:20]} Bxf4
{[%clk 0:38:14]} 26. gxf4 {[%clk 0:34:14]} Rxd5 {[%clk 0:38:10]} 27. Re7
{[%clk 0:27:46]} Rd4 {[%clk 0:36:06]} 28. Bd2 {[%clk 0:27:39]} Kf8
{[%clk 0:31:12]} 29. Bb4 {[%clk 0:27:31]} Re8 {[%clk 0:30:06]} 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.09"]
[Round "1.2"]
[White "Caruana, Fabiano"]
[Black "Anand, Viswanathan"]
[Result "1/2-1/2"]
[BlackElo "2779"]
[WhiteElo "2823"]
[LiveChessVersion "1.4.8"]
[ECO "A21"]

1. c4 {[%clk 1:59:57]} e5 {[%clk 1:59:49]} 2. Nc3 {[%clk 1:59:51]} Bb4
{[%clk 1:59:39]} 3. Nd5 {[%clk 1:59:45]} Bc5 {[%clk 1:59:28]} 4. Nf3
{[%clk 1:59:37]} c6 {[%clk 1:59:14]} 5. Nc3 {[%clk 1:59:32]} d6 {[%clk 1:59:04]}
6. g3 {[%clk 1:59:25]} Nf6 {[%clk 1:55:15]} 7. Bg2 {[%clk 1:59:08]} O-O
{[%clk 1:53:21]} 8. O-O {[%clk 1:58:54]} Re8 {[%clk 1:42:54]} 9. d3
{[%clk 1:58:40]} h6 {[%clk 1:42:04]} 10. Na4 {[%clk 1:57:22]} Bb4
{[%clk 1:39:28]} 11. a3 {[%clk 1:57:15]} Ba5 {[%clk 1:39:22]} 12. b4
{[%clk 1:57:08]} Bc7 {[%clk 1:39:16]} 13. e4 {[%clk 1:54:41]} Bg4
{[%clk 1:33:10]} 14. h3 {[%clk 1:45:33]} Bxf3 {[%clk 1:32:14]} 15. Qxf3
{[%clk 1:45:11]} Nbd7 {[%clk 1:31:04]} 16. Qd1 {[%clk 1:26:09]} a6
{[%clk 1:25:10]} 17. Nc3 {[%clk 1:08:27]} Bb6 {[%clk 1:17:00]} 18. Ne2
{[%clk 1:07:15]} a5 {[%clk 1:11:08]} 19. Bb2 {[%clk 1:02:02]} Qe7
{[%clk 1:02:04]} 20. Kh2 {[%clk 0:47:50]} axb4 {[%clk 0:57:39]} 21. axb4
{[%clk 0:47:44]} Rxa1 {[%clk 0:56:47]} 22. Qxa1 {[%clk 0:43:53]} h5
{[%clk 0:52:07]} 23. Kh1 {[%clk 0:31:24]} h4 {[%clk 0:45:43]} 24. g4
{[%clk 0:24:19]} Nh7 {[%clk 0:40:17]} 25. f4 {[%clk 0:20:29]} Be3
{[%clk 0:37:59]} 26. Bc3 {[%clk 0:13:01]} c5 {[%clk 0:30:05]} 27. bxc5
{[%clk 0:10:32]} Nxc5 {[%clk 0:30:05]} 28. Qb1 {[%clk 0:10:32]} Ra8
{[%clk 0:30:05]} 29. d4 {[%clk 0:10:32]} exd4 {[%clk 0:30:05]} 30. Nxd4
{[%clk 0:10:32]} Bxd4 {[%clk 0:30:05]} 31. Bxd4 {[%clk 0:10:32]} Rc8
{[%clk 0:30:05]} 32. Ba1 {[%clk 0:10:32]} Nf6 {[%clk 0:30:05]} 33. e5
{[%clk 0:10:32]} dxe5 {[%clk 0:30:05]} 34. Bxe5 {[%clk 0:10:32]} Nfd7
{[%clk 0:30:05]} 35. Bc3 {[%clk 0:10:32]} Qe3 {[%clk 0:30:05]} 36. Ba1
{[%clk 0:10:32]} Re8 {[%clk 0:30:05]} 37. Qb2 {[%clk 0:10:32]} Nf6
{[%clk 0:30:05]} 38. Qd4 {[%clk 0:10:32]} b6 {[%clk 0:30:05]} 39. Qxe3
{[%clk 0:10:32]} Rxe3 {[%clk 0:30:05]} 40. Bd4 {[%clk 0:10:32]} Rd3
{[%clk 0:30:05]} 41. Bf2 {[%clk 0:10:32]} Rc3 {[%clk 0:30:05]} 42. Bxh4
{[%clk 0:10:32]} Rd3 {[%clk 1:05:01]} 43. Bf2 Rc3 {[%clk 1:04:48]} 44. Bh4
{[%clk 0:54:55]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.09"]
[Round "1.3"]
[White "Kramnik, Vladimir"]
[Black "Topalov, Veselin"]
[Result "1-0"]
[BlackElo "2760"]
[WhiteElo "2809"]
[LiveChessVersion "1.4.8"]
[ECO "A06"]

1. Nf3 {[%clk 1:59:56]} d5 {[%clk 1:59:37]} 2. g3 {[%clk 1:59:49]} g6
{[%clk 1:59:16]} 3. Bg2 {[%clk 1:59:41]} Bg7 {[%clk 1:58:55]} 4. d4
{[%clk 1:59:39]} Nf6 {[%clk 1:58:47]} 5. O-O {[%clk 1:59:33]} O-O
{[%clk 1:58:39]} 6. c4 {[%clk 1:59:28]} c5 {[%clk 1:56:45]} 7. dxc5
{[%clk 1:57:33]} dxc4 {[%clk 1:55:19]} 8. Na3 {[%clk 1:52:41]} c3
{[%clk 1:52:15]} 9. Nb5 {[%clk 1:51:57]} cxb2 {[%clk 1:48:30]} 10. Bxb2
{[%clk 1:51:16]} Bd7 {[%clk 1:41:06]} 11. Qb3 {[%clk 1:41:52]} Bc6
{[%clk 1:36:29]} 12. Rfd1 {[%clk 1:38:09]} Qc8 {[%clk 1:35:37]} 13. Rac1
{[%clk 1:36:51]} Nbd7 {[%clk 1:27:49]} 14. Nbd4 {[%clk 1:32:32]} Bd5
{[%clk 1:24:56]} 15. Qa3 {[%clk 1:26:55]} Re8 {[%clk 1:17:49]} 16. c6
{[%clk 1:19:01]} Nb6 {[%clk 1:13:06]} 17. c7 {[%clk 1:09:10]} Nc4
{[%clk 1:11:11]} 18. Qb4 {[%clk 1:05:36]} Nxb2 {[%clk 1:09:17]} 19. Qxb2
{[%clk 1:03:20]} b6 {[%clk 1:07:01]} 20. Qa3 {[%clk 0:53:04]} e6 {[%clk 1:00:11]}
21. Nb5 {[%clk 0:49:28]} Bf8 {[%clk 0:53:38]} 22. Qb2 {[%clk 0:48:03]} Bg7
{[%clk 0:38:59]} 23. Qd2 {[%clk 0:35:08]} Qd7 {[%clk 0:28:32]} 24. a4
{[%clk 0:33:37]} Ne4 {[%clk 0:26:49]} 25. Qf4 {[%clk 0:27:50]} a6
{[%clk 0:20:48]} 26. Qxe4 {[%clk 0:25:54]} axb5 {[%clk 0:17:11]} 27. Qd3
{[%clk 0:21:35]} f5 {[%clk 0:12:33]} 28. Ng5 {[%clk 0:19:04]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.09"]
[Round "1.4"]
[White "Vachier-Lagrave, Maxime"]
[Black "Giri, Anish"]
[Result "1/2-1/2"]
[BlackElo "2771"]
[WhiteElo "2804"]
[LiveChessVersion "1.4.8"]
[ECO "B90"]

1. e4 {[%clk 1:59:54]} c5 {[%clk 1:59:57]} 2. Nf3 {[%clk 1:59:49]} d6
{[%clk 1:59:55]} 3. d4 {[%clk 1:59:45]} cxd4 {[%clk 1:59:51]} 4. Nxd4
{[%clk 1:59:41]} Nf6 {[%clk 1:59:48]} 5. Nc3 {[%clk 1:59:38]} a6 {[%clk 1:59:45]}
6. h3 {[%clk 1:59:11]} e5 {[%clk 1:59:28]} 7. Nde2 {[%clk 1:59:07]} h5
{[%clk 1:59:23]} 8. g3 {[%clk 1:59:02]} Be6 {[%clk 1:59:17]} 9. Bg2
{[%clk 1:58:36]} b5 {[%clk 1:59:12]} 10. O-O {[%clk 1:57:51]} Nbd7
{[%clk 1:58:30]} 11. Be3 {[%clk 1:57:21]} Be7 {[%clk 1:58:04]} 12. Nd5
{[%clk 1:57:13]} Nxd5 {[%clk 1:57:21]} 13. exd5 {[%clk 1:57:09]} Bf5
{[%clk 1:57:17]} 14. f4 {[%clk 1:57:01]} Rc8 {[%clk 1:57:06]} 15. c3
{[%clk 1:55:55]} Bh7 {[%clk 1:56:58]} 16. a4 {[%clk 1:42:39]} O-O
{[%clk 1:54:22]} 17. axb5 {[%clk 1:41:04]} axb5 {[%clk 1:54:10]} 18. Ra6
{[%clk 1:32:38]} exf4 {[%clk 1:32:40]} 19. Nxf4 {[%clk 1:26:39]} h4
{[%clk 1:32:17]} 20. Bd4 {[%clk 1:17:53]} Ne5 {[%clk 1:23:51]} 21. Nh5
{[%clk 1:14:23]} Bg6 {[%clk 1:21:09]} 22. Nf4 {[%clk 1:07:01]} Bh7
{[%clk 1:18:56]} 23. Nh5 {[%clk 1:04:53]} Bg6 {[%clk 1:18:10]} 24. Nf4
{[%clk 1:00:08]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.09"]
[Round "1.5"]
[White "Aronian, Levon"]
[Black "Adams, Michael"]
[Result "1-0"]
[BlackElo "2748"]
[WhiteElo "2785"]
[LiveChessVersion "1.4.8"]
[ECO "C50"]

1. e4 {[%clk 1:59:56]} e5 {[%clk 1:59:54]} 2. Nf3 {[%clk 1:59:52]} Nc6
{[%clk 1:59:49]} 3. Bc4 {[%clk 1:59:47]} Bc5 {[%clk 1:59:42]} 4. d3
{[%clk 1:59:30]} Nf6 {[%clk 1:59:00]} 5. c3 {[%clk 1:58:59]} d6 {[%clk 1:57:13]}
6. Bg5 {[%clk 1:58:53]} h6 {[%clk 1:46:13]} 7. Bh4 {[%clk 1:58:48]} a6
{[%clk 1:46:04]} 8. Nbd2 {[%clk 1:58:38]} Ba7 {[%clk 1:45:08]} 9. Bb3
{[%clk 1:56:55]} Qe7 {[%clk 1:43:12]} 10. Nc4 {[%clk 1:45:33]} Be6
{[%clk 1:34:12]} 11. Ne3 {[%clk 1:40:15]} g5 {[%clk 1:24:48]} 12. Bg3
{[%clk 1:40:10]} O-O-O {[%clk 1:22:07]} 13. Ba4 {[%clk 1:33:22]} Nb8
{[%clk 1:17:59]} 14. Qc2 {[%clk 1:26:46]} Bxe3 {[%clk 1:08:47]} 15. fxe3
{[%clk 1:26:11]} Nh5 {[%clk 1:08:43]} 16. Bf2 {[%clk 1:19:53]} f5
{[%clk 1:06:48]} 17. exf5 {[%clk 1:19:01]} Bxf5 {[%clk 1:06:39]} 18. Qe2
{[%clk 1:16:35]} Bxd3 {[%clk 0:45:54]} 19. Qxd3 {[%clk 1:16:24]} e4
{[%clk 0:45:51]} 20. Qd4 {[%clk 1:13:32]} c5 {[%clk 0:42:05]} 21. Qd1
{[%clk 1:10:32]} exf3 {[%clk 0:41:52]} 22. Qxf3 {[%clk 1:10:25]} Nf6
{[%clk 0:40:42]} 23. Bc2 {[%clk 1:10:10]} Nbd7 {[%clk 0:31:10]} 24. O-O-O
{[%clk 1:06:35]} Ne5 {[%clk 0:30:31]} 25. Qe2 {[%clk 1:02:12]} Qe6
{[%clk 0:25:16]} 26. Bg3 {[%clk 1:02:05]} Qxa2 {[%clk 0:16:44]} 27. Rhf1
{[%clk 0:46:08]} Nd5 {[%clk 0:15:37]} 28. Bxe5 {[%clk 0:44:29]} dxe5
{[%clk 0:14:58]} 29. Bb1 {[%clk 0:39:22]} Qb3 {[%clk 0:10:33]} 30. Bc2
{[%clk 0:35:28]} Qa2 {[%clk 0:10:31]} 31. Qg4+ {[%clk 0:34:08]} Kb8
{[%clk 0:10:22]} 32. Qe4 {[%clk 0:33:49]} Nb6 {[%clk 0:05:19]} 33. Qxe5+
{[%clk 0:30:08]} Ka8 {[%clk 0:05:12]} 34. Rxd8+ {[%clk 0:26:50]} Rxd8
{[%clk 0:05:10]} 35. Qf6 {[%clk 0:25:58]} Nc4 {[%clk 0:02:38]} 36. Qxd8+
{[%clk 0:25:53]} Ka7 {[%clk 0:02:37]} 37. Qd3 {[%clk 0:25:39]} Nxb2
{[%clk 0:00:53]} 38. Qf5 {[%clk 0:24:24]} Qa1+ {[%clk 0:00:34]} 39. Kd2
{[%clk 0:24:10]} Nc4+ {[%clk 0:00:30]} 40. Ke2 {[%clk 1:24:25]} Qxc3
{[%clk 1:00:48]} 41. Qxc5+ {[%clk 1:24:46]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.10"]
[Round "2.1"]
[White "Kramnik, Vladimir"]
[Black "Aronian, Levon"]
[Result "1/2-1/2"]
[BlackElo "2785"]
[WhiteElo "2809"]
[LiveChessVersion "1.4.8"]
[ECO "A06"]

1. Nf3 {[%clk 1:59:56]} d5 {[%clk 1:59:48]} 2. g3 {[%clk 1:59:51]} Nf6
{[%clk 1:59:35]} 3. Bg2 {[%clk 1:59:43]} e6 {[%clk 1:59:30]} 4. O-O
{[%clk 1:59:35]} Be7 {[%clk 1:59:26]} 5. c4 {[%clk 1:59:27]} O-O {[%clk 1:59:19]}
6. b3 {[%clk 1:59:24]} b6 {[%clk 1:59:02]} 7. Nc3 {[%clk 1:57:48]} Bb7
{[%clk 1:58:37]} 8. d4 {[%clk 1:57:39]} Nbd7 {[%clk 1:51:27]} 9. Bb2
{[%clk 1:57:04]} Rc8 {[%clk 1:49:04]} 10. cxd5 {[%clk 1:51:22]} Nxd5
{[%clk 1:48:42]} 11. Nxd5 {[%clk 1:51:00]} Bxd5 {[%clk 1:48:15]} 12. Qd3
{[%clk 1:49:17]} c5 {[%clk 1:44:05]} 13. e4 {[%clk 1:42:22]} Bb7 {[%clk 1:38:23]}
14. Rad1 {[%clk 1:35:36]} cxd4 {[%clk 1:32:43]} 15. Nxd4 {[%clk 1:27:02]} Nf6
{[%clk 1:32:34]} 16. Qe2 {[%clk 1:14:51]} Qe8 {[%clk 1:32:21]} 17. a3
{[%clk 1:09:06]} a5 {[%clk 1:29:26]} 18. Rfe1 {[%clk 1:03:51]} Bc5
{[%clk 1:18:34]} 19. Nb5 {[%clk 0:52:27]} Qe7 {[%clk 1:05:06]} 20. e5
{[%clk 0:41:55]} Bxg2 {[%clk 1:04:53]} 21. exf6 {[%clk 0:41:39]} Qb7
{[%clk 1:04:50]} 22. Nd6 {[%clk 0:34:34]} Bxd6 {[%clk 1:04:45]} 23. Rxd6
{[%clk 0:34:07]} Bh1 {[%clk 1:01:10]} 24. f3 {[%clk 0:31:29]} Qxf3
{[%clk 0:52:24]} 25. Qd2 {[%clk 0:17:07]} Qg2+ {[%clk 0:51:15]} 26. Qxg2
{[%clk 0:14:48]} Bxg2 {[%clk 0:51:09]} 27. fxg7 {[%clk 0:14:36]} Rfe8
{[%clk 0:51:06]} 28. Re2 {[%clk 0:11:37]} Bf3 {[%clk 0:48:30]} 29. Rf2
{[%clk 0:11:19]} Be4 {[%clk 0:43:32]} 30. Re2 {[%clk 0:08:52]} Bf3
{[%clk 0:43:10]} 31. Rf2 {[%clk 0:08:04]} Be4 {[%clk 0:43:05]} 32. Re2
{[%clk 0:07:08]} 1/2-1/2

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.10"]
[Round "2.2"]
[White "Anand, Viswanathan"]
[Black "Vachier-Lagrave, Maxime"]
[Result "1-0"]
[BlackElo "2804"]
[WhiteElo "2779"]
[LiveChessVersion "1.4.8"]
[ECO "B90"]

1. e4 {[%clk 1:59:57]} c5 {[%clk 1:59:56]} 2. Nf3 {[%clk 1:59:51]} d6
{[%clk 1:59:53]} 3. d4 {[%clk 1:59:44]} cxd4 {[%clk 1:59:49]} 4. Nxd4
{[%clk 1:59:39]} Nf6 {[%clk 1:59:41]} 5. Nc3 {[%clk 1:59:32]} a6 {[%clk 1:59:38]}
6. h3 {[%clk 1:59:25]} e5 {[%clk 1:59:30]} 7. Nb3 {[%clk 1:59:18]} Be6
{[%clk 1:59:06]} 8. f4 {[%clk 1:58:54]} Nbd7 {[%clk 1:55:33]} 9. g4
{[%clk 1:56:17]} Rc8 {[%clk 1:51:36]} 10. f5 {[%clk 1:54:36]} Bxb3
{[%clk 1:49:45]} 11. axb3 {[%clk 1:54:27]} d5 {[%clk 1:43:31]} 12. exd5
{[%clk 1:53:43]} Bb4 {[%clk 1:43:14]} 13. Bg2 {[%clk 1:53:33]} Qb6
{[%clk 1:38:25]} 14. Bd2 {[%clk 1:47:33]} e4 {[%clk 1:27:50]} 15. Qe2
{[%clk 1:44:44]} O-O {[%clk 1:27:34]} 16. O-O-O {[%clk 1:41:36]} Nc5
{[%clk 1:25:58]} 17. Kb1 {[%clk 1:34:55]} Rfd8 {[%clk 1:08:52]} 18. Rhe1
{[%clk 1:24:32]} a5 {[%clk 0:51:01]} 19. Qf2 {[%clk 1:10:18]} Qc7
{[%clk 0:32:37]} 20. Bf4 {[%clk 0:48:55]} Qb6 {[%clk 0:29:59]} 21. Be5
{[%clk 0:45:15]} a4 {[%clk 0:28:32]} 22. bxa4 Bxc3 {[%clk 0:27:46]} 23. Bxc3
{[%clk 0:37:29]} Nxd5 {[%clk 0:27:30]} 24. Rxd5 Rxd5 {[%clk 0:27:24]} 25. Bxe4
{[%clk 0:29:50]} Rd6 {[%clk 0:23:17]} 26. a5 {[%clk 0:26:47]} Qb5
{[%clk 0:17:35]} 27. Qe2 {[%clk 0:25:04]} Qxe2 {[%clk 0:14:13]} 28. Rxe2
{[%clk 0:24:59]} Rd1+ {[%clk 0:13:19]} 29. Ka2 {[%clk 0:24:53]} Re8
{[%clk 0:13:13]} 30. Bf3 {[%clk 0:24:43]} Rxe2 {[%clk 0:13:09]} 31. Bxe2
{[%clk 0:24:38]} Rc1 {[%clk 0:13:02]} 32. Bf3 {[%clk 0:24:17]} Rxc2
{[%clk 0:12:11]} 33. Bxb7 {[%clk 0:22:24]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.10"]
[Round "2.3"]
[White "So, Wesley"]
[Black "Adams, Michael"]
[Result "1-0"]
[BlackElo "2748"]
[WhiteElo "2794"]
[LiveChessVersion "1.4.8"]
[ECO "E06"]

1. d4 {[%clk 1:59:58]} Nf6 {[%clk 1:59:53]} 2. c4 {[%clk 1:59:52]} e6
{[%clk 1:59:49]} 3. g3 {[%clk 1:59:48]} d5 {[%clk 1:59:35]} 4. Bg2
{[%clk 1:59:42]} Be7 {[%clk 1:58:31]} 5. Nf3 {[%clk 1:59:35]} O-O
{[%clk 1:58:26]} 6. O-O {[%clk 1:59:30]} dxc4 {[%clk 1:58:23]} 7. Qc2
{[%clk 1:59:24]} a6 {[%clk 1:58:19]} 8. a4 {[%clk 1:59:19]} Bd7 {[%clk 1:57:47]}
9. Qxc4 {[%clk 1:59:14]} Bc6 {[%clk 1:57:17]} 10. Bg5 {[%clk 1:59:08]} a5
{[%clk 1:54:17]} 11. Nc3 {[%clk 1:56:11]} Ra6 {[%clk 1:50:30]} 12. Qd3
{[%clk 1:53:50]} Rb6 {[%clk 1:47:38]} 13. Qc2 {[%clk 1:53:36]} h6
{[%clk 1:46:03]} 14. Bd2 {[%clk 1:45:51]} Bb4 {[%clk 1:25:33]} 15. Rfe1
{[%clk 1:35:51]} Bxf3 {[%clk 1:22:56]} 16. Bxf3 {[%clk 1:35:45]} Nc6
{[%clk 1:22:53]} 17. e3 {[%clk 1:33:04]} e5 {[%clk 1:20:37]} 18. Bxc6
{[%clk 1:22:41]} exd4 {[%clk 1:19:11]} 19. Bf3 {[%clk 1:21:49]} dxc3
{[%clk 1:18:28]} 20. bxc3 {[%clk 1:21:19]} Bc5 {[%clk 1:15:18]} 21. Rab1
{[%clk 0:52:29]} Rd6 {[%clk 1:11:08]} 22. Red1 {[%clk 0:48:17]} b6
{[%clk 1:09:38]} 23. c4 {[%clk 0:47:58]} Qe7 {[%clk 1:05:12]} 24. Bc3
{[%clk 0:46:31]} Rfd8 {[%clk 1:04:29]} 25. Bb2 {[%clk 0:40:34]} Qe6
{[%clk 0:50:12]} 26. Rxd6 {[%clk 0:38:31]} Rxd6 {[%clk 0:49:14]} 27. Rd1
{[%clk 0:38:10]} Rxd1+ {[%clk 0:42:23]} 28. Qxd1 {[%clk 0:38:06]} Bd6
{[%clk 0:41:13]} 29. Qd4 {[%clk 0:24:54]} Qe8 {[%clk 0:38:18]} 30. Bd1
{[%clk 0:23:47]} Qc6 {[%clk 0:28:04]} 31. Bc2 {[%clk 0:21:35]} Kf8
{[%clk 0:27:24]} 32. e4 {[%clk 0:16:42]} Bc5 {[%clk 0:12:50]} 33. Qd8+
{[%clk 0:16:38]} Ne8 {[%clk 0:12:46]} 34. Qd5 {[%clk 0:16:33]} Qg6
{[%clk 0:12:33]} 35. Kg2 {[%clk 0:15:48]} Ke7 {[%clk 0:07:59]} 36. f4
{[%clk 0:13:35]} c6 {[%clk 0:06:39]} 37. Qd3 {[%clk 0:13:21]} Nc7
{[%clk 0:04:12]} 38. f5 {[%clk 0:11:48]} Qg5 {[%clk 0:01:56]} 39. Be5
{[%clk 1:10:21]} Ne6 {[%clk 1:00:33]} 40. fxe6 {[%clk 1:10:07]} 1-0

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.10"]
[Round "2.4"]
[White "Topalov, Veselin"]
[Black "Caruana, Fabiano"]
[Result "0-1"]
[BlackElo "2823"]
[WhiteElo "2760"]
[LiveChessVersion "1.4.8"]
[ECO "C02"]

1. e4 {[%clk 1:59:55]} e6 {[%clk 1:59:52]} 2. d4 {[%clk 1:59:44]} d5
{[%clk 1:59:47]} 3. e5 {[%clk 1:58:31]} c5 {[%clk 1:59:38]} 4. c3
{[%clk 1:58:27]} Nc6 {[%clk 1:59:07]} 5. Nf3 {[%clk 1:58:19]} Bd7
{[%clk 1:50:16]} 6. Be2 {[%clk 1:55:25]} Nge7 {[%clk 1:46:12]} 7. h4 Qb6
{[%clk 1:19:02]} 8. Na3 {[%clk 1:51:50]} cxd4 {[%clk 1:16:39]} 9. cxd4
{[%clk 1:51:44]} Nb4 {[%clk 1:15:36]} 10. h5 {[%clk 1:45:11]} h6 {[%clk 1:15:31]}
11. Bd2 {[%clk 1:42:23]} a6 {[%clk 1:13:35]} 12. Bc3 {[%clk 1:39:58]} Nec6
{[%clk 1:12:54]} 13. Rh3 {[%clk 1:34:44]} O-O-O {[%clk 1:09:47]} 14. Kf1
{[%clk 1:27:01]} Kb8 {[%clk 1:03:17]} 15. Qd2 {[%clk 1:24:20]} f6
{[%clk 0:51:49]} 16. exf6 {[%clk 1:17:20]} gxf6 {[%clk 0:51:39]} 17. Rg3
{[%clk 1:16:50]} Be8 {[%clk 0:47:13]} 18. Nh4 {[%clk 1:13:43]} Bd6
{[%clk 0:37:49]} 19. Rg7 {[%clk 1:09:01]} e5 {[%clk 0:36:45]} 20. dxe5
{[%clk 0:57:00]} fxe5 {[%clk 0:35:58]} 21. Ng6 {[%clk 0:56:35]} Bxg6
{[%clk 0:19:26]} 22. hxg6 {[%clk 0:56:29]} e4 {[%clk 0:17:55]} 23. Rf7
{[%clk 0:53:18]} Rhg8 {[%clk 0:11:06]} 24. g7 {[%clk 0:47:40]} Ka7 25. Qxh6
{[%clk 0:40:28]} Nd3 {[%clk 0:09:51]} 26. Bxd3 {[%clk 0:32:06]} exd3
{[%clk 0:09:46]} 27. Re1 {[%clk 0:31:39]} Bc5 {[%clk 0:07:09]} 28. Re6
{[%clk 0:29:33]} Rc8 {[%clk 0:04:11]} 29. Qg5 {[%clk 0:24:41]} Bd4
{[%clk 0:02:36]} 30. Re1 {[%clk 0:15:54]} Bxc3 {[%clk 0:02:00]} 31. bxc3
{[%clk 0:15:49]} Qb2 {[%clk 0:01:30]} 32. Nb1 {[%clk 0:14:25]} Rce8
{[%clk 0:01:13]} 33. Qd2 {[%clk 0:10:54]} Rxe1+ {[%clk 0:01:11]} 34. Qxe1
{[%clk 0:10:46]} d4 {[%clk 0:01:09]} 35. Nd2 {[%clk 0:07:09]} dxc3
{[%clk 0:00:53]} 36. Nc4 {[%clk 0:06:19]} Re8 {[%clk 0:00:30]} 37. Rxb7+ Qxb7
{[%clk 0:00:24]} 38. Qxe8 {[%clk 0:01:49]} Qb1+ {[%clk 0:00:22]} 0-1

[Event "London Chess Classic 2016"]
[Site "London"]
[Date "2016.12.10"]
[Round "2.5"]
[White "Giri, Anish"]
[Black "Nakamura, Hikaru"]
[Result "1/2-1/2"]
[BlackElo "2779"]
[WhiteElo "2771"]
[LiveChessVersion "1.4.8"]
[ECO "A49"]

1. d4 {[%clk 1:59:57]} Nf6 {[%clk 1:59:54]} 2. Nf3 {[%clk 1:59:52]} g6
{[%clk 1:59:48]} 3. g3 {[%clk 1:55:42]} Bg7 {[%clk 1:59:30]} 4. Bg2
{[%clk 1:55:37]} O-O {[%clk 1:59:16]} 5. c4 {[%clk 1:54:55]} c5 {[%clk 1:58:37]}
6. Nc3 {[%clk 1:53:03]} cxd4 {[%clk 1:57:01]} 7. Qxd4 {[%clk 1:51:30]} Qa5
{[%clk 1:14:02]} 8. O-O {[%clk 1:45:36]} Qh5 {[%clk 1:12:08]} 9. Qe5
{[%clk 1:37:01]} Qxe5 {[%clk 1:10:44]} 10. Nxe5 {[%clk 1:36:57]} Nc6
{[%clk 1:10:39]} 11. Nd3 {[%clk 1:35:40]} b6 {[%clk 0:57:35]} 12. Bg5
{[%clk 1:06:58]} Ba6 {[%clk 0:51:49]} 13. b3 {[%clk 1:05:55]} h6 {[%clk 0:50:36]}
14. Bd2 {[%clk 1:02:46]} Rac8 {[%clk 0:50:07]} 15. Rac1 {[%clk 1:02:22]} Rfd8
{[%clk 0:49:56]} 16. Rfd1 {[%clk 1:00:17]} e6 {[%clk 0:48:43]} 17. Bf4
{[%clk 0:55:22]} Ne8 {[%clk 0:44:02]} 18. h4 {[%clk 0:53:48]} Bf8
{[%clk 0:36:58]} 19. Ne5 {[%clk 0:51:17]} Nxe5 {[%clk 0:35:25]} 20. Bxe5
{[%clk 0:51:12]} Bg7 {[%clk 0:35:16]} 21. Bxg7 {[%clk 0:49:39]} Kxg7
{[%clk 0:35:10]} 22. a4 {[%clk 0:45:19]} g5 {[%clk 0:27:26]} 23. hxg5
{[%clk 0:40:56]} hxg5 {[%clk 0:27:21]} 24. e3 {[%clk 0:29:29]} Nf6
{[%clk 0:26:12]} 25. Rd6 {[%clk 0:23:39]} Kf8 {[%clk 0:25:44]} 26. Rcd1
{[%clk 0:21:26]} Rc5 {[%clk 0:21:01]} 27. Na2 {[%clk 0:19:39]} Bc8
{[%clk 0:19:21]} 28. Nb4 {[%clk 0:19:28]} Re8 {[%clk 0:19:18]} 29. Nd3
{[%clk 0:17:50]} Ra5 {[%clk 0:17:25]} 30. Nb2 {[%clk 0:16:58]} Rc5
{[%clk 0:17:20]} 31. Nd3 {[%clk 0:16:25]} Ra5 {[%clk 0:17:06]} 32. Nb2
{[%clk 0:16:11]} Rc5 {[%clk 0:17:01]} 33. R6d2 {[%clk 0:15:15]} g4
{[%clk 0:14:51]} 34. Nd3 {[%clk 0:13:57]} Rc7 {[%clk 0:14:37]} 35. Ne5
{[%clk 0:12:18]} Ke7 {[%clk 0:14:15]} 36. a5 {[%clk 0:11:24]} bxa5
{[%clk 0:11:59]} 37. Ra2 {[%clk 0:10:34]} Bb7 {[%clk 0:11:31]} 38. Rxa5
{[%clk 0:10:01]} Bxg2 {[%clk 0:11:23]} 39. Kxg2 {[%clk 0:10:00]} Rb8
{[%clk 0:11:14]} 40. Ra3 {[%clk 1:08:37]} Rc5 {[%clk 1:08:24]} 41. Nd3
{[%clk 1:06:50]} Rc7 {[%clk 1:05:33]} 42. Ne5 {[%clk 1:02:50]} Rc5
{[%clk 1:05:27]} 43. Nd3 {[%clk 1:03:17]} Rc7 {[%clk 1:05:56]} 1/2-1/2

';
}