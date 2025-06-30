using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotorcycleDealership.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddThirtyMotorcyclesData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
        INSERT INTO ""Motorcycles"" (""Id"", ""Brand"", ""Model"", ""Year"", ""Price"", ""IsAvailable"", ""Description"", ""ImageUrl"")
        VALUES
            ('550e8400-e29b-41d4-a716-446655440000', 'Harley-Davidson', 'Sportster', 2023, 15000.00, true, 'A classic American cruiser with modern features.', 'https://imgd.aeplcdn.com/1280x720/n/m7nl79b_1795937.jpg'),
            ('550e8400-e29b-41d4-a716-446655440001', 'Yamaha', 'MT-07', 2022, 7500.00, true, 'A versatile middleweight naked bike with great handling.', 'https://kingfish.by/upload/iblock/2c5/9d9aea3c_a0fa_11e6_80bb_002590a1f45d_9d9aea3e_a0fa_11e6_80bb_002590a1f45d.jpeg'),
            ('550e8400-e29b-41d4-a716-446655440002', 'Honda', 'CBR600RR', 2021, 11000.00, false, 'A high-performance sportbike for track enthusiasts.', 'https://static.tildacdn.com/tild6563-3737-4237-b962-356262613234/2006-honda-cbr600rr-.jpg'),
            ('550e8400-e29b-41d4-a716-446655440003', 'Kawasaki', 'Ninja 400', 2023, 5500.00, true, 'An entry-level sportbike perfect for beginners.', 'https://imgd.aeplcdn.com/1056x594/n/bw/models/colors/kawasaki-select-model-metallic-carbon-gray-1676441556058.png'),
            ('550e8400-e29b-41d4-a716-446655440004', 'Ducati', 'Panigale V4', 2024, 25000.00, true, 'A top-tier superbike with cutting-edge technology.', 'https://omoimot.ru/photos/15220719588616-Ducati-Ducati_Panigale-V4-2018-xl.jpg'),
            ('550e8400-e29b-41d4-a716-446655440005', 'Suzuki', 'GSX-R750', 2022, 9500.00, false, 'A balanced sportbike with a rich racing heritage.', 'https://www.globalsuzuki.com/motorcycle/smgs/digital-archive/images/2_bike/sports/img_081_11.jpg'),
            ('550e8400-e29b-41d4-a716-446655440006', 'BMW', 'S 1000 RR', 2023, 18000.00, true, 'A powerful sportbike with advanced electronics.', 'https://www.4moto-shop.de/images/product_images/original_images/BMW_S1000RR_2023_Bikedekor_Graphics_4moto_M-Design_1.jpg'),
            ('550e8400-e29b-41d4-a716-446655440007', 'Triumph', 'Street Triple', 2021, 8500.00, true, 'A stylish and agile middleweight naked bike.', 'https://media.triumphmotorcycles.co.uk/image/upload/f_auto/q_auto:eco/sitecoremedialibrary/media-library/images/motorcycles/roadsters-supersports/my25/my25%20colours/step%20carousel_features/hj8/cornering-abs-step-carousel-street-triple-rs_my25_l.jpg'),
            ('550e8400-e29b-41d4-a716-446655440008', 'KTM', 'Duke 390', 2023, 5000.00, true, 'A lightweight and fun bike for urban riding.', 'https://static.leovince.com/products/1000/14395E_1-390.jpg'),
            ('550e8400-e29b-41d4-a716-446655440009', 'Aprilia', 'RSV4', 2024, 22000.00, true, 'A high-performance Italian superbike.', 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/192165/aprilia-rsv4-1100-factory-right-front-three-quarter1.jpeg'),
            ('550e8400-e29b-41d4-a716-44665544000a', 'Harley-Davidson', 'Fat Boy', 2022, 20000.00, false, 'A iconic custom cruiser with bold styling.', 'https://cdn.dealerspike.com/imglib/products/harley-showroom/2023/Cruiser/Fat-Boy-114-Anniversary/Fat-Boy-114-Anniversary-Heirloom-Red-Fade.png'),
            ('550e8400-e29b-41d4-a716-44665544000b', 'Yamaha', 'Tracer 9', 2023, 12000.00, true, 'A sport-touring bike with excellent comfort.', 'https://bike.net/res/media/img/hx400/ref/903/109071@2x.jpg'),
            ('550e8400-e29b-41d4-a716-44665544000c', 'Honda', 'Africa Twin', 2021, 14000.00, true, 'A rugged adventure bike for off-road exploration.', 'https://admin.motoland.md/storage/products/colors/dS6MOiDVXc0MU4LMJLOxwnBSoBCXtFQt0p2WV3dF.webp'),
            ('550e8400-e29b-41d4-a716-44665544000d', 'Kawasaki', 'Versys 650', 2022, 8000.00, true, 'A versatile adventure-tourer for long rides.', 'https://kawasaki-city.ru/files/cat/color_models/20KLE650F_44SWT1DRF1CG_A.png'),
            ('550e8400-e29b-41d4-a716-44665544000e', 'Ducati', 'Monster', 2023, 13000.00, false, 'A naked bike with Italian design flair.', 'https://ducatilondon.co.uk/storage/images/monster-ducati-red.png'),
            ('550e8400-e29b-41d4-a716-44665544000f', 'Suzuki', 'V-Strom 650', 2021, 7000.00, true, 'A reliable adventure bike for all terrains.', 'https://suzukimotorcycles.com.au/wp-content/uploads/2024/06/v-strom-650xt-yu1-product-specs-730x490-1.jpg'),
            ('550e8400-e29b-41d4-a716-446655440010', 'BMW', 'R 1250 GS', 2024, 19000.00, true, 'A premium adventure bike with advanced features.', 'https://i0.wp.com/www.asphaltandrubber.com/wp-content/uploads/2018/11/2019-BMW-R1250GS-Adventure-21-scaled.jpg'),
            ('550e8400-e29b-41d4-a716-446655440011', 'Triumph', 'Tiger 900', 2022, 15000.00, true, 'A capable adventure bike for off-road and on-road.', 'https://media.triumphmotorcycles.co.uk/image/upload/f_auto/q_auto:eco/sitecoremedialibrary/media-library/images/motorcycles/adventure-touring/my24/tiger%20900%202024/tiger%20900%20rally%20pro%20variant%20page/bikes-my24-tiger-900-rally-pro-sc2-1410x793.jpg'),
            ('550e8400-e29b-41d4-a716-446655440012', 'KTM', 'Super Duke 1290', 2023, 17000.00, false, 'A powerful naked bike with aggressive styling.', 'https://ktm-rus.ru/upload/iblock/c25/3wmfhpjar4y57ciikg1v4uq8uijf0ydy.png'),
            ('550e8400-e29b-41d4-a716-446655440013', 'Aprilia', 'Tuono V4', 2021, 16000.00, true, 'A high-revving naked sportbike.', 'https://cloudfront-us-east-1.images.arcpublishing.com/octane/7GKFZVECVRAKRBBFUWVEM5ESSI.jpg'),
            ('550e8400-e29b-41d4-a716-446655440014', 'Harley-Davidson', 'Road King', 2023, 22000.00, true, 'A luxurious touring bike with classic design.', 'https://cdn.dealerspike.com/imglib/products/harley-showroom/models/road-king-special/vivid-black-fs8.png'),
            ('550e8400-e29b-41d4-a716-446655440015', 'Yamaha', 'YZF-R1', 2022, 17000.00, false, 'A superbike designed for track performance.', 'https://www.4moto-shop.de/images/product_images/info_images/YAMAHA-1_0.JPG'),
            ('550e8400-e29b-41d4-a716-446655440016', 'Honda', 'Gold Wing', 2024, 28000.00, true, 'A premium touring bike with top comfort.', 'https://www.honda-moto.lv/files/a2025/527285_25ym_honda_gl1800_gold_wing_tour.jpg'),
            ('550e8400-e29b-41d4-a716-446655440017', 'Kawasaki', 'Z900', 2021, 9000.00, true, 'A powerful naked bike with smooth power delivery.', 'https://content2.kawasaki.com/ContentStorage/KMC/Products/9592/abb3bce2-860c-4cbc-8cce-22ed77e8f13d.png?w=767'),
            ('550e8400-e29b-41d4-a716-446655440018', 'Ducati', 'Scrambler', 2023, 10000.00, true, 'A retro-styled bike with modern tech.', 'https://universalmotors.ru/motorcycles/ducati/motorcycle-ducati-scrambler-800/1052132681563-sx1920x1080i561968.jpg'),
            ('550e8400-e29b-41d4-a716-446655440019', 'Suzuki', 'Katana', 2022, 13000.00, false, 'A revival of the iconic 1980s sportbike.', 'https://www.roadracingworld.com/wp-content/uploads/2023/09/KATANA_M3_YUA_diagonal_1695427369.jpg'),
            ('550e8400-e29b-41d4-a716-44665544001a', 'BMW', 'F 900 R', 2023, 9500.00, true, 'A dynamic roadster with sporty handling.', 'https://japanlife-moto.ru/upload/resize_cache/webp/catalog/data/imgs/bike_img/1/16406/1_l.webp'),
            ('550e8400-e29b-41d4-a716-44665544001b', 'Triumph', 'Speed Triple', 2021, 15000.00, true, 'A high-performance naked bike.', 'https://triumph.granmoto.ru/user/pages/02.motorcycles/01.roadsters/03.speed-triple/speed_triple_24_icon.png'),
            ('550e8400-e29b-41d4-a716-44665544001c', 'KTM', 'RC 390', 2023, 6000.00, true, 'A lightweight sportbike for track and road.', 'https://cloudfront-us-east-1.images.arcpublishing.com/octane/452TOP4M4JBBZNRG5PMHOWALQA.jpg'),
            ('550e8400-e29b-41d4-a716-44665544001d', 'Aprilia', 'Caponord 1200', 2022, 14000.00, false, 'An adventure-tourer with Italian flair.', 'https://s1.cdn.autoevolution.com/images/moto_models/APRILIA_ETV-1000-Caponord--2004_main.jpg');
    ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM \"Motorcycles\" WHERE \"Id\" IN ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-44665544000c', '550e8400-e29b-41d4-a716-44665544000d', '550e8400-e29b-41d4-a716-44665544000e', '550e8400-e29b-41d4-a716-44665544000f', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-44665544001a', '550e8400-e29b-41d4-a716-44665544001b', '550e8400-e29b-41d4-a716-44665544001c', '550e8400-e29b-41d4-a716-44665544001d');");
        }
    }
}
