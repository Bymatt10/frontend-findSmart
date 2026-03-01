import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

interface ChartData {
    name: string;
    amount: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
}

export function ExpensePieChart({ data }: { data: ChartData[] }) {
    return (
        <View className="items-center justify-center bg-zinc-900 rounded-3xl p-4 border border-zinc-800">
            <PieChart
                data={data}
                width={screenWidth - 80}
                height={220}
                chartConfig={{
                    backgroundColor: '#18181b', // zinc-900
                    backgroundGradientFrom: '#18181b',
                    backgroundGradientTo: '#18181b',
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor={"amount"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]}
                absolute
            />
        </View>
    );
}
