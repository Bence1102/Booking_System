<?php

namespace Database\Seeders;

use App\Models\Resource;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    public function run(): void
    {
        Resource::query()->delete();

        $resources = [
            [
                'name' => 'Tárgyaló A',
                'name_en' => 'Meeting Room A',
                'name_de' => 'Besprechungsraum A',
                'description' => 'Kisebb megbeszélésekre, 6 fő befogadására alkalmas.',
                'description_en' => 'For small meetings, seats up to 6 people.',
                'description_de' => 'Für kleinere Besprechungen, Platz für 6 Personen.',
                'image_url' => '/images/Atargyalo.jpg',
                'category' => 'meeting',
            ],
            [
                'name' => 'Tárgyaló B',
                'name_en' => 'Meeting Room B',
                'name_de' => 'Besprechungsraum B',
                'description' => 'Nagyobb tárgyaló, projektorral, 12 fő befogadására alkalmas.',
                'description_en' => 'Larger meeting room with a projector, seats up to 12.',
                'description_de' => 'Größerer Besprechungsraum mit Projektor, Platz für 12 Personen.',
                'image_url' => '/images/Btargyalo.jpg',
                'category' => 'meeting',
            ],
            [
                'name' => 'Konferenciaterem',
                'name_en' => 'Conference Hall',
                'name_de' => 'Konferenzsaal',
                'description' => 'Nagy létszámú előadásokhoz, videókonferencia-technikával, 40 fő.',
                'description_en' => 'For large presentations, with video conferencing equipment, 40 seats.',
                'description_de' => 'Für große Vorträge, mit Videokonferenztechnik, 40 Plätze.',
                'image_url' => '/images/konferenciaterem.jpg',
                'category' => 'meeting',
            ],
            [
                'name' => 'Rendezvényterem',
                'name_en' => 'Event Hall',
                'name_de' => 'Veranstaltungssaal',
                'description' => 'Nagyobb céges rendezvényekhez, akár 100 fős befogadóképességgel.',
                'description_en' => 'For larger corporate events, capacity up to 100 people.',
                'description_de' => 'Für größere Firmenveranstaltungen, Kapazität bis zu 100 Personen.',
                'image_url' => '/images/rendezvenyterem.jpg',
                'category' => 'meeting',
            ],
            [
                'name' => 'Focipálya',
                'name_en' => 'Football Pitch',
                'name_de' => 'Fußballplatz',
                'description' => 'Kültéri műfüves pálya, este megvilágítással.',
                'description_en' => 'Outdoor artificial turf pitch with evening floodlights.',
                'description_de' => 'Outdoor-Kunstrasenplatz mit Abendbeleuchtung.',
                'image_url' => '/images/focipalya.jpg',
                'category' => 'sport',
            ],
            [
                'name' => 'Kosárlabdapálya',
                'name_en' => 'Basketball Court',
                'name_de' => 'Basketballplatz',
                'description' => 'Fedett pálya, palánkkal és öltözővel.',
                'description_en' => 'Indoor court with backboards and changing rooms.',
                'description_de' => 'Überdachter Platz mit Körben und Umkleiden.',
                'image_url' => '/images/kosarpalya.jpg',
                'category' => 'sport',
            ],
            [
                'name' => 'Teniszpálya',
                'name_en' => 'Tennis Court',
                'name_de' => 'Tennisplatz',
                'description' => 'Salakos kültéri pálya, ütőkölcsönzési lehetőséggel.',
                'description_en' => 'Outdoor clay court, racket rental available.',
                'description_de' => 'Outdoor-Sandplatz, Schlägerverleih möglich.',
                'image_url' => '/images/teniszpalya.jpg',
                'category' => 'sport',
            ],
            [
                'name' => 'Squash pálya',
                'name_en' => 'Squash Court',
                'name_de' => 'Squashplatz',
                'description' => 'Fedett squash pálya, két fő részére.',
                'description_en' => 'Indoor squash court for two players.',
                'description_de' => 'Überdachter Squashplatz für zwei Personen.',
                'image_url' => '/images/squashpalya.jpg',
                'category' => 'sport',
            ],
            [
                'name' => 'Fitness stúdió',
                'name_en' => 'Fitness Studio',
                'name_de' => 'Fitnessstudio',
                'description' => 'Kisebb csoportos edzésekhez, tükörfallal és eszközökkel.',
                'description_en' => 'For small group workouts, with a mirror wall and equipment.',
                'description_de' => 'Für kleine Gruppentrainings, mit Spiegelwand und Geräten.',
                'image_url' => '/images/fitnessstudio.jpg',
                'category' => 'sport',
            ],
            [
                'name' => 'Vetítőterem',
                'name_en' => 'Screening Room',
                'name_de' => 'Vorführraum',
                'description' => 'Filmvetítésre és nagyobb prezentációkra alkalmas, mozivászonnal.',
                'description_en' => 'Suitable for screenings and larger presentations, with a cinema screen.',
                'description_de' => 'Geeignet für Filmvorführungen und größere Präsentationen, mit Kinoleinwand.',
                'image_url' => '/images/vetitoterem.png',
                'category' => 'creative',
            ],
            [
                'name' => 'Zenei próbaterem',
                'name_en' => 'Rehearsal Room',
                'name_de' => 'Proberaum',
                'description' => 'Hangszigetelt terem próbákhoz, alap hangosítással.',
                'description_en' => 'Soundproofed room for rehearsals, with basic PA equipment.',
                'description_de' => 'Schallisolierter Raum für Proben, mit einfacher Beschallung.',
                'image_url' => '/images/zeneprobaterem.jpg',
                'category' => 'creative',
            ],
            [
                'name' => 'Fotóstúdió',
                'name_en' => 'Photo Studio',
                'name_de' => 'Fotostudio',
                'description' => 'Háttérvászonnal és stúdióvilágítással felszerelt tér.',
                'description_en' => 'Space equipped with a backdrop and studio lighting.',
                'description_de' => 'Raum mit Hintergrundleinwand und Studiobeleuchtung.',
                'image_url' => '/images/fotostudio.jpg',
                'category' => 'creative',
            ],
            [
                'name' => 'Bowlingpálya',
                'name_en' => 'Bowling Alley',
                'name_de' => 'Bowlingbahn',
                'description' => 'Két sávos bowlingpálya, cipőkölcsönzéssel.',
                'description_en' => 'Two-lane bowling alley, shoe rental included.',
                'description_de' => 'Bowlingbahn mit zwei Bahnen, inklusive Schuhverleih.',
                'image_url' => '/images/bowling.jpg',
                'category' => 'sport',
            ],
            [
                'name' => 'Tornaterem',
                'name_en' => 'Gymnasium',
                'name_de' => 'Turnhalle',
                'description' => 'Nagy alapterületű csarnok csapatsportokhoz és testnevelés órákhoz.',
                'description_en' => 'Large hall for team sports and PE classes.',
                'description_de' => 'Große Halle für Mannschaftssport und Sportunterricht.',
                'image_url' => '/images/tesiterem.jpg',
                'category' => 'sport',
            ],
        ];

        foreach ($resources as $resource) {
            Resource::create($resource);
        }
    }
}